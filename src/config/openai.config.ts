import { registerAs } from '@nestjs/config';
import { OpenAIConfigSchema } from './schemas';

export default registerAs('openai', () => {
	const config = {
		apiKey: process.env.OPENAI_API_KEY,
		baseURL: process.env.OPENAI_BASE_URL,
		model: process.env.OPENAI_MODEL,
	};

	return OpenAIConfigSchema.parse(config);
});
