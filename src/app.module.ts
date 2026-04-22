import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HealthModule, JobsModule } from './modules';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';

import { ConfigModule, AppConfigService, pinoConfig } from './config';

@Module({
	imports: [
		// 全局配置模块
		ConfigModule,

		// 定时任务模块
		ScheduleModule.forRoot(),

		// Redis 缓存
		CacheModule.registerAsync({
			isGlobal: true,
			inject: [AppConfigService],
			useFactory: (config: AppConfigService) => {
				const auth = config.redis.password ? `:${config.redis.password}@` : '';
				const redisUri = `redis://${auth}${config.redis.host}:${config.redis.port}/${config.redis.db}`;

				return {
					stores: [new RedisStore(redisUri)],
					ttl: config.redis.ttl * 1000,
				};
			},
		}),

		// 限流
		ThrottlerModule.forRootAsync({
			inject: [AppConfigService],
			useFactory: (config: AppConfigService) => [
				{
					ttl: config.security.rateLimit.ttl,
					limit: config.security.rateLimit.limit,
				},
			],
		}),
		LoggerModule.forRoot(pinoConfig),
		HealthModule,
		JobsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule {}
