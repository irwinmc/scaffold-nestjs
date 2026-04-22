import { z } from 'zod';

/**
 * 安全配置 Schema
 */
export const SecurityConfigSchema = z.object({
	rateLimit: z.object({
		ttl: z.coerce.number().int().min(1).default(60),
		limit: z.coerce.number().int().min(1).default(100),
	}),
});

export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
