import { z } from 'zod';

/**
 * Logger 配置 Schema
 */
export const LoggerConfigSchema = z.object({
	level: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
	prettyPrint: z.boolean().default(false),
});

export type LoggerConfig = z.infer<typeof LoggerConfigSchema>;
