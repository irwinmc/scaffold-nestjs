import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Root')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiOperation({ summary: 'Get API Information' })
	@ApiResponse({ status: 200, description: 'API information' })
	getInfo() {
		return this.appService.getApiInfo();
	}
}
