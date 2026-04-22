import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FullConfigSchema, FullConfig } from '../schemas';

@Injectable()
export class AppConfigService implements OnModuleInit {
	private readonly log = new Logger(AppConfigService.name);

	private _config!: FullConfig;

	constructor(private readonly configService: ConfigService) {}

	onModuleInit() {
		try {
			this._config = FullConfigSchema.parse({
				app: {
					nodeEnv: this.configService.get('app.nodeEnv'),
					port: this.configService.get('app.port'),
					apiPrefix: this.configService.get('app.apiPrefix'),
					apiKey: this.configService.get('app.apiKey'),
				},
				security: {
					rateLimit: {
						ttl: this.configService.get('security.rateLimit.ttl'),
						limit: this.configService.get('security.rateLimit.limit'),
					},
				},
				jwt: {
					secret: this.configService.get('jwt.secret'),
					expiresIn: this.configService.get('jwt.expiresIn'),
					refreshExpiresIn: this.configService.get('jwt.refreshExpiresIn'),
				},
				redis: {
					host: this.configService.get('redis.host'),
					port: this.configService.get('redis.port'),
					password: this.configService.get('redis.password'),
					db: this.configService.get('redis.db'),
					ttl: this.configService.get('redis.ttl'),
				},
				database: {
					host: this.configService.get('database.host'),
					port: this.configService.get('database.port'),
					user: this.configService.get('database.user'),
					password: this.configService.get('database.password'),
					database: this.configService.get('database.database'),
					ssl: this.configService.get('database.ssl', false),
					max: this.configService.get('database.max'),
					idleTimeout: this.configService.get('database.idleTimeout'),
					connectTimeout: this.configService.get('database.connectTimeout'),
				},
				swagger: {
					title: this.configService.get('swagger.title'),
					description: this.configService.get('swagger.description'),
					version: this.configService.get('swagger.version'),
					enabled: this.configService.get('swagger.enabled', false),
				},
				cors: {
					origin: this.configService.get('cors.origin'),
					methods: this.configService.get('cors.methods'),
				},
				openai: {
					apiKey: this.configService.get('openai.apiKey'),
					baseURL: this.configService.get('openai.baseURL'),
					model: this.configService.get('openai.model'),
				},
			});

			this.log.log('Configuration validation successful');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			this.log.error(`Configuration validation failed: ${message}`, error);
			throw new Error(`Invalid configuration: ${message}`);
		}
	}

	get app() {
		return this._config.app;
	}
	get security() {
		return this._config.security;
	}
	get jwt() {
		return this._config.jwt;
	}
	get redis() {
		return this._config.redis;
	}
	get database() {
		return this._config.database;
	}
	get swagger() {
		return this._config.swagger;
	}
	get cors() {
		return this._config.cors;
	}
	get openai() {
		return this._config.openai;
	}
}
