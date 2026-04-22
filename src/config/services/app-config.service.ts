import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	FullConfigSchema,
	AppConfig,
	SecurityConfig,
	JwtConfig,
	RedisConfig,
	LoggerConfig,
	SwaggerConfig,
	CorsConfig,
	OpenAIConfig,
	DatabaseConfig,
	AppConfigSchema,
	SecurityConfigSchema,
	JwtConfigSchema,
	RedisConfigSchema,
	LoggerConfigSchema,
	SwaggerConfigSchema,
	CorsConfigSchema,
	OpenAIConfigSchema,
	DatabaseConfigSchema,
} from '../schemas';

/**
 * 强类型配置服务
 *
 * 提供类型安全的配置访问接口
 * 在模块初始化时验证所有配置
 */
@Injectable()
export class AppConfigService implements OnModuleInit {
	private readonly log = new Logger(AppConfigService.name);

	constructor(private readonly configService: ConfigService) {}

	/**
	 * 模块初始化时验证所有配置
	 */
	onModuleInit() {
		this.validateConfig();
	}

	/**
	 * 验证所有配置
	 * 如果验证失败，应用启动时即抛出异常
	 */
	private validateConfig(): void {
		try {
			const config = {
				app: this.buildAppConfig(),
				security: this.buildSecurityConfig(),
				jwt: this.buildJwtConfig(),
				redis: this.buildRedisConfig(),
				logger: this.buildLoggerConfig(),
				swagger: this.buildSwaggerConfig(),
				cors: this.buildCorsConfig(),
				openai: this.buildOpenaiConfig(),
				database: this.buildDatabaseConfig(),
			};

			// 使用 Zod 验证完整配置
			FullConfigSchema.parse(config);

			this.log.log('Configuration validation successful');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			this.log.error(`Configuration validation failed: ${message}`, error);
			throw new Error(`Invalid configuration: ${message}`);
		}
	}

	/**
	 * 获取应用配置（类型安全）
	 */
	get app(): AppConfig {
		const config = this.buildAppConfig();
		return AppConfigSchema.parse(config);
	}

	/**
	 * 获取安全配置（类型安全）
	 */
	get security(): SecurityConfig {
		const config = this.buildSecurityConfig();
		return SecurityConfigSchema.parse(config);
	}

	/**
	 * 获取 JWT 配置（类型安全）
	 */
	get jwt(): JwtConfig {
		const config = this.buildJwtConfig();
		return JwtConfigSchema.parse(config);
	}

	/**
	 * 获取 Redis 配置（类型安全）
	 */
	get redis(): RedisConfig {
		const config = this.buildRedisConfig();
		return RedisConfigSchema.parse(config);
	}

	/**
	 * 获取 Logger 配置（类型安全）
	 */
	get logger(): LoggerConfig {
		const config = this.buildLoggerConfig();
		return LoggerConfigSchema.parse(config);
	}

	/**
	 * 获取 Swagger 配置（类型安全）
	 */
	get swagger(): SwaggerConfig {
		const config = this.buildSwaggerConfig();
		return SwaggerConfigSchema.parse(config);
	}

	/**
	 * 获取 CORS 配置（类型安全）
	 */
	get cors(): CorsConfig {
		const config = this.buildCorsConfig();
		return CorsConfigSchema.parse(config);
	}

	/**
	 * 获取 OpenAI 配置（类型安全）
	 */
	get openai(): OpenAIConfig {
		const config = this.buildOpenaiConfig();
		return OpenAIConfigSchema.parse(config);
	}

	/**
	 * 获取 Database 配置（类型安全）
	 */
	get database(): DatabaseConfig {
		const config = this.buildDatabaseConfig();
		return DatabaseConfigSchema.parse(config);
	}

	/**
	 * 辅助方法：构建应用配置
	 */
	private buildAppConfig() {
		return {
			nodeEnv: this.configService.get('app.nodeEnv'),
			port: this.configService.get('app.port'),
			apiPrefix: this.configService.get('app.apiPrefix'),
			apiKey: this.configService.get('app.apiKey'),
		};
	}

	/**
	 * 辅助方法：构建安全配置
	 */
	private buildSecurityConfig() {
		return {
			rateLimit: {
				ttl: this.configService.get('security.rateLimit.ttl'),
				limit: this.configService.get('security.rateLimit.limit'),
			},
		};
	}

	/**
	 * 辅助方法：构建 JWT 配置
	 */
	private buildJwtConfig() {
		return {
			secret: this.configService.get('jwt.secret'),
			expiresIn: this.configService.get('jwt.expiresIn'),
			refreshExpiresIn: this.configService.get('jwt.refreshExpiresIn'),
		};
	}

	/**
	 * 辅助方法：构建 Redis 配置
	 */
	private buildRedisConfig() {
		return {
			host: this.configService.get('redis.host'),
			port: this.configService.get('redis.port'),
			password: this.configService.get('redis.password'),
			db: this.configService.get('redis.db'),
			ttl: this.configService.get('redis.ttl'),
		};
	}

	/**
	 * 辅助方法：构建 Logger 配置
	 */
	private buildLoggerConfig() {
		return {
			level: this.configService.get('LOG_LEVEL', 'info'),
			prettyPrint: this.configService.get('app.nodeEnv') !== 'production',
		};
	}

	/**
	 * 辅助方法：构建 Swagger 配置
	 */
	private buildSwaggerConfig() {
		return {
			title: 'Ops Shop API',
			description: 'Ops API Documentation',
			version: '1.0',
			enabled: this.configService.get('app.nodeEnv') !== 'production',
		};
	}

	/**
	 * 辅助方法：构建 CORS 配置
	 */
	private buildCorsConfig() {
		return {
			origin: this.configService.get('cors.origin'),
			methods: this.configService.get('cors.methods'),
		};
	}

	/**
	 * 辅助方法：构建 OpenAI 配置
	 */
	private buildOpenaiConfig() {
		return {
			apiKey: this.configService.get('openai.apiKey'),
			baseURL: this.configService.get('openai.baseURL'),
			model: this.configService.get('openai.model'),
			translationBaseURL: this.configService.get('openai.translationBaseURL'),
			translationApiKey: this.configService.get('openai.translationApiKey'),
			translationModel: this.configService.get('openai.translationModel'),
		};
	}

	/**
	 * 辅助方法：构建 Database 配置
	 */
	private buildDatabaseConfig() {
		return {
			host: this.configService.get('database.host'),
			port: this.configService.get('database.port'),
			username: this.configService.get('database.username'),
			password: this.configService.get('database.password'),
			database: this.configService.get('database.database'),
			ssl: this.configService.get('database.ssl', false),
		};
	}
}
