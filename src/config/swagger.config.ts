import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
	.setTitle('Scaffold Server API')
	.setDescription('Scaffold Server API Documentation')
	.setVersion('1.0')
	.addTag('Health', 'Health Check Endpoints')
	.addBearerAuth()
	.build();
