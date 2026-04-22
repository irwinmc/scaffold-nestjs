import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_DATABASE,
	ssl: process.env.DATABASE_SSL === 'true',
	max: process.env.DATABASE_MAX,
	idleTimeout: process.env.DATABASE_IDLE_TIMEOUT,
	connectTimeout: process.env.DATABASE_CONNECT_TIMEOUT,
}));
