import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('tasks')
export class TaskHandler extends WorkerHost {
	private readonly logger = new Logger(TaskHandler.name);

	async process(job: Job): Promise<void> {
		this.logger.log(`Processing job ${job.id} (${job.name}), data: ${JSON.stringify(job.data)}`);

		await new Promise(resolve => setImmediate(resolve));

		switch (job.name) {
			case 'log':
				this.logger.log(`Log task: ${job.data.message}`);
				break;
			default:
				this.logger.warn(`Unknown task: ${job.name}`);
		}
	}
}
