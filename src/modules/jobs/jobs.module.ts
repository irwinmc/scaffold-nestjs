import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JobsService } from './jobs.service';
import { StartupHandler, TaskHandler } from './handlers';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'tasks',
		}),
	],
	providers: [JobsService, StartupHandler, TaskHandler],
	exports: [JobsService],
})
export class JobsModule {}
