import { z } from 'zod';

/**
 * 应用配置 Schema
 */
export const AppConfigSchema = z.object({
	nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
	port: z.coerce.number().int().min(1).max(65535).default(3000),
	apiPrefix: z.string().min(1).default('api/v1'),
	apiKey: z.string().optional(),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
