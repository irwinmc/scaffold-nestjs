import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { RedisService } from './redis.service';

@Injectable()
export class RedisHealthIndicator {
	constructor(
		private readonly redisService: RedisService,
		private readonly healthIndicatorService: HealthIndicatorService,
	) {}

	async isHealthy() {
		const indicator = this.healthIndicatorService.check('redis');

		try {
			const client = this.redisService.getClient();
			await client.ping();
			return indicator.up();
		} catch (error) {
			return indicator.down({ message: (error as Error).message });
		}
	}
}
