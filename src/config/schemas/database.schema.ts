import { z } from 'zod';

/**
 * 数据库配置
 */
export const DatabaseConfigSchema = z.object({
	host: z.string().min(1).default('localhost'),
	port: z.coerce.number().int().min(1).max(65535).default(5432),
	user: z.string().min(1),
	password: z.string().min(1),
	database: z.string().min(1),
	ssl: z.boolean().default(false),
	max: z.coerce.number().int().min(1).default(10),
	idleTimeout: z.coerce.number().int().min(1).default(20),
	connectTimeout: z.coerce.number().int().min(1).default(10),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
