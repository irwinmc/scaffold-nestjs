import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
		app.setGlobalPrefix('api/v1', { exclude: ['/'] });
		await app.init();
		await app.getHttpAdapter().getInstance().ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('/ (GET)', async () => {
		const res = await request(app.getHttpServer()).get('/').expect(200);

		expect(res.body).toMatchObject({
			name: 'Scaffold Server',
			version: '0.0.1',
		});
		expect(res.body).toHaveProperty('environment');
		expect(res.body).toHaveProperty('apiPrefix');
		expect(res.body).toHaveProperty('endpoints');
		expect(res.body).toHaveProperty('timestamp');
	});
});
