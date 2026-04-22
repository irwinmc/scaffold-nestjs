import { z } from 'zod';

/**
 * JWT 配置 Schema
 */
export const JwtConfigSchema = z.object({
	secret: z.string().min(1),
	expiresIn: z.number().default(3600),
	refreshExpiresIn: z.number().default(604800),
});

export type JwtConfig = z.infer<typeof JwtConfigSchema>;
