import { Global, Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIHealthIndicator } from './openai.health';

@Global()
@Module({
	providers: [OpenAIService, OpenAIHealthIndicator],
	exports: [OpenAIService, OpenAIHealthIndicator],
})
export class OpenAIModule {}
