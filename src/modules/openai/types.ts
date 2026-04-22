import type { ChatCompletionCreateParams } from 'openai/resources';

export interface ChatCompletionOptions {
	model?: string;
	temperature?: number;
	maxTokens?: number;
	responseFormat?: ChatCompletionCreateParams['response_format'];
	tools?: ChatCompletionCreateParams['tools'];
	toolChoice?: ChatCompletionCreateParams['tool_choice'];
}

export interface EmbeddingOptions {
	model?: string;
	dimensions?: number;
}
