import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
	rateLimit: {
		ttl: process.env.RATE_LIMIT_TTL,
		limit: process.env.RATE_LIMIT_MAX,
	},
}));
