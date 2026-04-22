import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './services/app-config.service';

import appConfig from './app.config';
import securityConfig from './security.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import corsConfig from './cors.config';
import openaiConfig from './openai.config';
import databaseConfig from './database.config';

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
			load: [appConfig, securityConfig, jwtConfig, redisConfig, corsConfig, openaiConfig, databaseConfig],
			envFilePath: ['.env'],
		}),
	],
	providers: [AppConfigService],
	exports: [AppConfigService],
})
export class ConfigModule {}
