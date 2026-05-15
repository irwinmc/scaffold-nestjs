import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';

import { AllExceptionsFilter } from './common/filters';
import { ConfigModule, AppConfigService, pinoConfig } from './config';
import { HealthModule, JobsModule, RedisModule, DatabaseModule, OpenAIModule } from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			inject: [AppConfigService],
			useFactory: (config: AppConfigService) => ({
				secret: config.jwt.secret,
				signOptions: { expiresIn: config.jwt.expiresIn },
			}),
		}),
		ScheduleModule.forRoot(),
		ThrottlerModule.forRootAsync({
			inject: [AppConfigService],
			useFactory: (config: AppConfigService) => [
				{
					ttl: config.security.rateLimit.ttl,
					limit: config.security.rateLimit.limit,
				},
			],
		}),
		BullModule.forRootAsync({
			inject: [AppConfigService],
			useFactory: (config: AppConfigService) => ({
				connection: {
					host: config.redis.host,
					port: config.redis.port,
					password: config.redis.password,
					db: config.redis.db,
				},
			}),
		}),
		LoggerModule.forRoot(pinoConfig),
		HealthModule,
		JobsModule,
		RedisModule,
		DatabaseModule,
		OpenAIModule,
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
