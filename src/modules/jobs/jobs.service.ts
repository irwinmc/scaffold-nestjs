import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { StartupHandler } from './handlers';

@Injectable()
export class JobsService {
	private readonly logger = new Logger(JobsService.name);

	constructor(
		private readonly startupHandler: StartupHandler,
		@InjectQueue('tasks') private readonly tasksQueue: Queue,
	) {
		this.logger.log('JobsService initialized with 1 handler and tasks queue');
	}

	async addTask(name: string, data: Record<string, unknown>, opts?: { delay?: number }): Promise<string> {
		const job = await this.tasksQueue.add(name, data, opts);
		this.logger.log(`Job added: ${job.id} (${name})`);
		return job.id ?? '';
	}

	getQueue(): Queue {
		return this.tasksQueue;
	}
}
