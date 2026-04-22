import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { OpenAIService } from '@/modules/openai';

@Injectable()
export class OpenAIHealthIndicator {
	constructor(
		private readonly openaiService: OpenAIService,
		private readonly healthIndicatorService: HealthIndicatorService,
	) {}

	async isHealthy() {
		const indicator = this.healthIndicatorService.check('openai');

		try {
			const client = this.openaiService.getClient();
			await client.models.list();
			return indicator.up();
		} catch (error) {
			return indicator.down({ message: (error as Error).message });
		}
	}
}
