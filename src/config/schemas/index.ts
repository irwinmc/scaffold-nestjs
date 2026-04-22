import { z } from 'zod';
import { AppConfigSchema } from './app.schema';
import { SecurityConfigSchema } from './security.schema';
import { JwtConfigSchema } from './jwt.schema';
import { RedisConfigSchema } from './redis.schema';
import { DatabaseConfigSchema } from './database.schema';
import { CorsConfigSchema } from './cors.schema';
import { OpenAIConfigSchema } from './openai.schema';
import { SwaggerConfigSchema } from './swagger.schema';

export const FullConfigSchema = z.object({
	app: AppConfigSchema,
	security: SecurityConfigSchema,
	jwt: JwtConfigSchema,
	redis: RedisConfigSchema,
	database: DatabaseConfigSchema,
	cors: CorsConfigSchema,
	openai: OpenAIConfigSchema,
	swagger: SwaggerConfigSchema,
});

export type FullConfig = z.infer<typeof FullConfigSchema>;

export * from './app.schema';
export * from './security.schema';
export * from './jwt.schema';
export * from './redis.schema';
export * from './database.schema';
export * from './cors.schema';
export * from './openai.schema';
export * from './swagger.schema';
