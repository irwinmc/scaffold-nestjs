import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@/config';

@Injectable()
export class AppService {
	constructor(private readonly config: AppConfigService) {}

	getApiInfo() {
		const apiPrefix = this.config.app.apiPrefix;
		const env = this.config.app.nodeEnv;

		return {
			name: 'Ops Server',
			version: '1.0.0',
			environment: env,
			apiPrefix: `/${apiPrefix}`,
			endpoints: {
				swagger: '/api-docs',
				health: `/${apiPrefix}/health`,
				users: `/${apiPrefix}/users`,
			},
			timestamp: new Date().toISOString(),
		};
	}
}
