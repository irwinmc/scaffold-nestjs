import { Logger } from '@nestjs/common';
import { AppConfigService } from '@/config/services/app-config.service';
import { ConfigService } from '@nestjs/config';

function validConfig(): Record<string, unknown> {
	return {
		'app.nodeEnv': 'test',
		'app.port': 3000,
		'app.apiPrefix': 'api/v1',
		'app.apiKey': '',

		'security.rateLimit.ttl': 60,
		'security.rateLimit.limit': 100,

		'jwt.secret': 'test-secret',
		'jwt.expiresIn': 3600,
		'jwt.refreshExpiresIn': 604800,

		'redis.host': 'localhost',
		'redis.port': 6379,
		'redis.password': '',
		'redis.db': 3,
		'redis.ttl': 3600,

		'database.host': 'localhost',
		'database.port': 5432,
		'database.user': 'postgres',
		'database.password': 'postgres',
		'database.database': 'testdb',
		'database.ssl': false,
		'database.max': 10,
		'database.idleTimeout': 20,
		'database.connectTimeout': 10,

		'swagger.title': 'Test API',
		'swagger.description': 'Test Description',
		'swagger.version': '1.0',
		'swagger.enabled': false,

		'cors.origin': ['*'],
		'cors.methods': ['GET', 'POST'],

		'openai.apiKey': 'sk-test',
		'openai.baseURL': 'https://api.openai.com/v1',
		'openai.model': 'gpt-4o-mini',
	};
}

function mockConfigService(values: Record<string, unknown>): ConfigService {
	return {
		get: jest.fn((path: string, defaultValue?: unknown) => {
			return values[path] ?? defaultValue;
		}),
	} as unknown as ConfigService;
}

describe('AppConfigService', () => {
	beforeAll(() => {
		Logger.overrideLogger(false);
	});

	afterAll(() => {
		Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose']);
	});

	describe('valid configuration', () => {
		it('should create successfully and expose all config via getters', () => {
			const configService = mockConfigService(validConfig());
			const appConfig = new AppConfigService(configService);

			expect(appConfig.app.port).toBe(3000);
			expect(appConfig.app.nodeEnv).toBe('test');
			expect(appConfig.jwt.secret).toBe('test-secret');
			expect(appConfig.redis.host).toBe('localhost');
			expect(appConfig.database.port).toBe(5432);
			expect(appConfig.openai.apiKey).toBe('sk-test');
			expect(appConfig.security.rateLimit.ttl).toBe(60);
		});

		it('should fall back to Schema defaults for missing optional fields', () => {
			const values = validConfig();
			values['app.nodeEnv'] = undefined;
			values['app.port'] = undefined;

			const appConfig = new AppConfigService(mockConfigService(values));

			expect(appConfig.app.nodeEnv).toBe('development');
			expect(appConfig.app.port).toBe(3000);
		});
	});

	describe('invalid configuration', () => {
		it('should throw when jwt.secret is missing', () => {
			const values = validConfig();
			values['jwt.secret'] = undefined;

			expect(() => new AppConfigService(mockConfigService(values))).toThrow(/Invalid configuration/);
		});

		it('should throw when openai.apiKey is empty string', () => {
			const values = validConfig();
			values['openai.apiKey'] = '';

			expect(() => new AppConfigService(mockConfigService(values))).toThrow(/Invalid configuration/);
		});
	});
});
