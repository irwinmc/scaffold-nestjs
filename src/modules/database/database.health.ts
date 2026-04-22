import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { DatabaseService } from './database.service';

@Injectable()
export class DatabaseHealthIndicator {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly healthIndicatorService: HealthIndicatorService,
	) {}

	async isHealthy() {
		const indicator = this.healthIndicatorService.check('database');

		try {
			await this.databaseService.query.execute('SELECT 1');
			return indicator.up();
		} catch (error) {
			return indicator.down({ message: (error as Error).message });
		}
	}
}
