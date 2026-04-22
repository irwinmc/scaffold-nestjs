import { HttpException, HttpStatus } from '@nestjs/common';
import { APIError, APIConnectionError } from 'openai';

export class OpenAIException extends HttpException {
	constructor(message: string, status: number, cause?: unknown) {
		super({ message, error: 'OpenAIException' }, status, { cause });
	}
}

export function handleOpenAIError(error: unknown): never {
	if (error instanceof APIConnectionError) {
		throw new OpenAIException('OpenAI service unavailable', HttpStatus.SERVICE_UNAVAILABLE, error);
	}

	if (error instanceof APIError) {
		const status = error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

		if (status === 401) {
			throw new OpenAIException('OpenAI authentication failed', status, error);
		}
		if (status === 429) {
			throw new OpenAIException('OpenAI rate limit exceeded', status, error);
		}

		throw new OpenAIException(error.message, status, error);
	}

	const message = error instanceof Error ? error.message : 'Unknown OpenAI error';
	throw new OpenAIException(message, HttpStatus.INTERNAL_SERVER_ERROR, error);
}
