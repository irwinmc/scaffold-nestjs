import { z } from 'zod';

/**
 * OpenAI 配置 Schema
 */
export const OpenAIConfigSchema = z.object({
	apiKey: z.string().min(1, 'OPENAI_API_KEY is required'),
	baseURL: z.url().optional().default('https://api.openai.com/v1'),
	model: z.string().default('gpt-4o-mini'),
});

export type OpenAIConfig = z.infer<typeof OpenAIConfigSchema>;
