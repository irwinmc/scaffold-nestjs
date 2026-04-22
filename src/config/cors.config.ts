import { registerAs } from '@nestjs/config';
import { CorsConfigSchema } from './schemas';

export default registerAs('cors', () => {
	const config = {
		origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()) : true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	};

	return CorsConfigSchema.parse(config);
});
