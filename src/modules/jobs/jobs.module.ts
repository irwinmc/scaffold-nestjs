import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { StartupHandler } from './handlers';

@Module({
	imports: [],
	providers: [JobsService, StartupHandler],
	exports: [JobsService],
})
export class JobsModule {}
