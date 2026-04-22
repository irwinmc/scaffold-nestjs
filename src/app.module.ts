import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';

import { AllExceptionsFilter } from './common/filters';
import { ConfigModule, AppConfigService, pinoConfig } from './config';
import { HealthModule, JobsModule, RedisModule, DatabaseModule } from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule,
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
		LoggerModule.forRoot(pinoConfig),
		HealthModule,
		JobsModule,
		RedisModule,
		DatabaseModule,
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
