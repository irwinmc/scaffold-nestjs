import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@/common/decorators';
import { DatabaseHealthIndicator } from '../database';
import { RedisHealthIndicator } from '../redis';
import { OpenAIHealthIndicator } from '../openai';

@ApiTags('Health')
@Controller()
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private databaseHealth: DatabaseHealthIndicator,
		private redisHealth: RedisHealthIndicator,
		private openaiHealth: OpenAIHealthIndicator,
	) {}

	@Get('health')
	@Public()
	@HealthCheck()
	@ApiOperation({ summary: 'Health Check' })
	check() {
		return this.health.check([
			() => this.databaseHealth.isHealthy(),
			() => this.redisHealth.isHealthy(),
			() => this.openaiHealth.isHealthy(),
		]);
	}
}
