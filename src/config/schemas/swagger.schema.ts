import { z } from 'zod';

/**
 * Swagger 配置 Schema
 */
export const SwaggerConfigSchema = z.object({
	title: z.string().default('Scaffold Server API'),
	description: z.string().default('Scaffold Server API Documentation'),
	version: z.string().default('1.0'),
	enabled: z.boolean().default(false),
});

export type SwaggerConfig = z.infer<typeof SwaggerConfigSchema>;
