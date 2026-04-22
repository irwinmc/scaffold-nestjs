import { registerAs } from '@nestjs/config';
import { RedisConfigSchema } from './schemas';

export default registerAs('redis', () => {
	const config = {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
		db: process.env.REDIS_DB,
		ttl: process.env.REDIS_TTL,
	};

	return RedisConfigSchema.parse(config);
});
