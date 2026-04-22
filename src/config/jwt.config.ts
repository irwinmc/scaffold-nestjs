import { registerAs } from '@nestjs/config';
import { JwtConfigSchema } from './schemas';

export default registerAs('jwt', () => {
	const config = {
		secret: process.env.JWT_SECRET,
		expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10),
		refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800', 10),
	};

	return JwtConfigSchema.parse(config);
});
