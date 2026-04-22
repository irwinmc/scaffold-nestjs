import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
	.setTitle('Ops Server API')
	.setDescription('Ops Server API Documentation')
	.setVersion('1.0')
	.addTag('Health', 'Health Check Endpoints')
	.addBearerAuth()
	.build();
