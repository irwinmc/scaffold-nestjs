import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@/common/decorators';

@ApiTags('Health')
@Controller()
export class HealthController {
	constructor(private health: HealthCheckService) {}

	@Get('health')
	@Public()
	@HealthCheck()
	@ApiOperation({ summary: 'Health Check' })
	check() {
		return this.health.check([
			() => ({
				app: {
					status: 'up',
					timestamp: new Date().toISOString(),
					uptime: process.uptime(),
					version: process.env.npm_package_version || '0.0.1',
				},
			}),
		]);
	}
}
