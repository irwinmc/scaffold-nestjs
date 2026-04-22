import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class StartupHandler {
	private readonly logger = new Logger(StartupHandler.name);

	@Timeout(5000)
	execute() {
		this.logger.log('Startup task: Application started');
	}
}
