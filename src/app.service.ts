import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@/config';

@Injectable()
export class AppService {
	constructor(private readonly config: AppConfigService) {}

	getApiInfo() {
		const apiPrefix = this.config.app.apiPrefix;
		const env = this.config.app.nodeEnv;

		return {
			name: 'Scaffold Server',
			version: '0.0.1',
			environment: env,
			apiPrefix: `/${apiPrefix}`,
			endpoints: {
				swagger: '/api-docs',
				health: `/${apiPrefix}/health`,
			},
			timestamp: new Date().toISOString(),
		};
	}
}
