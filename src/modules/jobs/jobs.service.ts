import { Injectable, Logger } from '@nestjs/common';
import { StartupHandler } from './handlers';

@Injectable()
export class JobsService {
	private readonly logger = new Logger(JobsService.name);

	constructor(private readonly startupHandler: StartupHandler) {
		this.logger.log('JobsService initialized with 1 handler');
	}
}
