import { z } from 'zod';
import { AppConfigSchema } from './app.schema';
import { SecurityConfigSchema } from './security.schema';
import { JwtConfigSchema } from './jwt.schema';
import { RedisConfigSchema } from './redis.schema';
import { LoggerConfigSchema } from './logger.schema';
import { SwaggerConfigSchema } from './swagger.schema';
import { CorsConfigSchema } from './cors.schema';
import { OpenAIConfigSchema } from './openai.schema';

/**
 * 完整的应用配置 Schema
 */
export const FullConfigSchema = z.object({
	app: AppConfigSchema,
	security: SecurityConfigSchema,
	jwt: JwtConfigSchema,
	redis: RedisConfigSchema,
	logger: LoggerConfigSchema,
	swagger: SwaggerConfigSchema,
	cors: CorsConfigSchema,
	openai: OpenAIConfigSchema,
});

export type FullConfig = z.infer<typeof FullConfigSchema>;

// 导出所有 schemas
export * from './app.schema';
export * from './security.schema';
export * from './jwt.schema';
export * from './redis.schema';
export * from './logger.schema';
export * from './swagger.schema';
export * from './cors.schema';
export * from './openai.schema';
