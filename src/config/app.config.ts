import { registerAs } from '@nestjs/config';
import { AppConfigSchema } from './schemas';

export default registerAs('app', () => {
	const config = {
		nodeEnv: process.env.NODE_ENV,
		port: process.env.PORT,
		apiPrefix: process.env.API_PREFIX,
		apiKey: process.env.API_KEY,
	};

	return AppConfigSchema.parse(config);
});
