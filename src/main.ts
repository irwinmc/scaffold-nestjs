import { NestFactory } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { AppConfigService } from '@/config';
import { TransformInterceptor } from '@/common/interceptors';
import { JwtAuthGuard } from '@/common/guards';

async function bootstrap() {
	const adapter = new FastifyAdapter({ logger: false });

	const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
		bufferLogs: true,
	});

	const logger = app.get(PinoLogger);
	const config = app.get(AppConfigService);
	const reflector = app.get(Reflector);
	const jwtService = app.get(JwtService);

	// Logger
	app.useLogger(logger);

	// Fastify
	await app.register(helmet);
	await app.register(compress);

	// CORS
	app.enableCors(config.cors);

	// 使用强类型配置
	const port = config.app.port;
	const apiPrefix = config.app.apiPrefix;
	app.setGlobalPrefix(apiPrefix, {
		exclude: ['/'],
	});

	app.useGlobalInterceptors(new TransformInterceptor());
	app.useGlobalPipes(new ZodValidationPipe());
	app.useGlobalGuards(new JwtAuthGuard(reflector, config, jwtService));

	// Swagger
	if (config.swagger.enabled) {
		const swaggerOptions = new DocumentBuilder()
			.setTitle(config.swagger.title)
			.setDescription(config.swagger.description)
			.setVersion(config.swagger.version)
			.addTag('Health', 'Health Check Endpoints')
			.addBearerAuth()
			.build();
		const document = SwaggerModule.createDocument(app, swaggerOptions);
		SwaggerModule.setup('api-docs', app, document);
		logger.log(`Swagger documentation: http://localhost:${port}/api-docs`);
	}

	// Start server
	await app.listen(port, '0.0.0.0');

	logger.log(`Application is running on: http://localhost:${port}`);
	logger.log(`API prefix: /${apiPrefix}`);
}

void bootstrap();
