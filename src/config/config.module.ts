import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './services/app-config.service';

import appConfig from './app.config';
import securityConfig from './security.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import databaseConfig from './database.config';
import corsConfig from './cors.config';
import openaiConfig from './openai.config';

/**
 * 全局配置模块
 *
 * 提供统一的配置访问入口
 */
@Global()
@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig, securityConfig, jwtConfig, redisConfig, databaseConfig, corsConfig, openaiConfig],
			envFilePath: ['.env'],
		}),
	],
	providers: [AppConfigService],
	exports: [AppConfigService],
})
export class ConfigModule {}
