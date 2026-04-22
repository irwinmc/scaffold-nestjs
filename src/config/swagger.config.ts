import { registerAs } from '@nestjs/config';
import { SwaggerConfigSchema } from './schemas';

export default registerAs('swagger', () => {
	const config = {
		title: process.env.SWAGGER_TITLE,
		description: process.env.SWAGGER_DESCRIPTION,
		version: process.env.SWAGGER_VERSION,
		enabled: process.env.SWAGGER_ENABLED === 'true',
	};

	return SwaggerConfigSchema.parse(config);
});
