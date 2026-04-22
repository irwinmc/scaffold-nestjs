import { z } from 'zod';

/**
 * Redis 配置 Schema
 */
export const RedisConfigSchema = z.object({
	host: z.string().min(1).default('localhost'),
	port: z.coerce.number().int().min(1).max(65535).default(6379),
	password: z.string().optional(),
	db: z.coerce.number().int().min(0).max(15).default(3),
	ttl: z.coerce.number().int().min(1).default(3600),
});

export type RedisConfig = z.infer<typeof RedisConfigSchema>;
