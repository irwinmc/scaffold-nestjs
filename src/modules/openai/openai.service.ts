import { Injectable, Logger, OnModuleDestroy, HttpException, HttpStatus } from '@nestjs/common';
import { OpenAI, APIError, APIConnectionError } from 'openai';
import type {
	ChatCompletion,
	ChatCompletionChunk,
	ChatCompletionMessageParam,
	CreateEmbeddingResponse,
} from 'openai/resources';
import { Stream } from 'openai/streaming';
import { AppConfigService } from '@/config';
import type { ChatCompletionOptions, EmbeddingOptions } from './types';

@Injectable()
export class OpenAIService implements OnModuleDestroy {
	private readonly logger = new Logger(OpenAIService.name);
	private readonly client: OpenAI;
	private readonly defaultModel: string;

	constructor(config: AppConfigService) {
		this.client = new OpenAI({
			apiKey: config.openai.apiKey,
			baseURL: config.openai.baseURL,
		});
		this.defaultModel = config.openai.model;
		this.logger.log('OpenAI client initialized');
	}

	async chatCompletion(
		messages: ChatCompletionMessageParam[],
		options?: ChatCompletionOptions,
	): Promise<ChatCompletion> {
		try {
			return await this.client.chat.completions.create({
				model: options?.model ?? this.defaultModel,
				messages,
				temperature: options?.temperature,
				max_tokens: options?.maxTokens,
				response_format: options?.responseFormat,
				tools: options?.tools,
				tool_choice: options?.toolChoice,
				stream: false,
			});
		} catch (error) {
			throw this.handleError(error);
		}
	}

	async chatCompletionStream(
		messages: ChatCompletionMessageParam[],
		options?: ChatCompletionOptions,
	): Promise<Stream<ChatCompletionChunk>> {
		try {
			return await this.client.chat.completions.create({
				model: options?.model ?? this.defaultModel,
				messages,
				temperature: options?.temperature,
				max_tokens: options?.maxTokens,
				tools: options?.tools,
				tool_choice: options?.toolChoice,
				stream: true,
			});
		} catch (error) {
			throw this.handleError(error);
		}
	}

	async createEmbedding(input: string | string[], options?: EmbeddingOptions): Promise<CreateEmbeddingResponse> {
		try {
			return await this.client.embeddings.create({
				model: options?.model ?? 'text-embedding-3-small',
				input,
				dimensions: options?.dimensions,
			});
		} catch (error) {
			throw this.handleError(error);
		}
	}

	getClient(): OpenAI {
		return this.client;
	}

	onModuleDestroy() {
		this.logger.log('OpenAI client shutting down');
	}

	private handleError(error: unknown): Error {
		if (error instanceof APIConnectionError) {
			this.logger.error(`OpenAI connection error: ${error.message}`);
			return new HttpException('OpenAI service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
		}

		if (error instanceof APIError) {
			this.logger.error(`OpenAI API error: ${error.status} ${error.message}`);

			if (error.status === 401) {
				return new HttpException('OpenAI authentication failed', HttpStatus.UNAUTHORIZED);
			}
			if (error.status === 429) {
				return new HttpException('OpenAI rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
			}
			if (error.status === 400) {
				return new HttpException(`OpenAI bad request: ${error.message}`, HttpStatus.BAD_REQUEST);
			}

			return new HttpException(
				`OpenAI API error: ${error.message}`,
				error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		const message = error instanceof Error ? error.message : 'Unknown OpenAI error';
		this.logger.error(`OpenAI unexpected error: ${message}`);
		return new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
