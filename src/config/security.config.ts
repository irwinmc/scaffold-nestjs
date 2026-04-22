import { registerAs } from '@nestjs/config';
import { SecurityConfigSchema } from './schemas';

export default registerAs('security', () => {
	const config = {
		rateLimit: {
			ttl: process.env.RATE_LIMIT_TTL,
			limit: process.env.RATE_LIMIT_MAX,
		},
	};

	return SecurityConfigSchema.parse(config);
});
