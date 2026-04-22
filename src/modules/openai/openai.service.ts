import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { OpenAI } from 'openai';
import type {
	ChatCompletion,
	ChatCompletionChunk,
	ChatCompletionMessageParam,
	CreateEmbeddingResponse,
} from 'openai/resources';
import { Stream } from 'openai/streaming';
import { AppConfigService } from '@/config';
import type { ChatCompletionOptions, EmbeddingOptions } from './types';
import { handleOpenAIError } from './openai.exception';

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
			handleOpenAIError(error);
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
			handleOpenAIError(error);
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
			handleOpenAIError(error);
		}
	}

	getClient(): OpenAI {
		return this.client;
	}

	onModuleDestroy() {
		this.logger.log('OpenAI client shutting down');
	}
}
