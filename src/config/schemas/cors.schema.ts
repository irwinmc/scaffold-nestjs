import { z } from 'zod';

/**
 * CORS 配置 Schema
 */
export const CorsConfigSchema = z.object({
	origin: z.union([z.boolean(), z.array(z.string())]),
	methods: z.array(z.string()),
});

export type CorsConfig = z.infer<typeof CorsConfigSchema>;
