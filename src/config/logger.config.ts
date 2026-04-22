import { Params } from 'nestjs-pino';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { join } from 'path';

export const pinoConfig: Params = {
	pinoHttp: {
		transport:
			process.env.NODE_ENV !== 'production'
				? {
						target: 'pino-pretty',
						options: {
							colorize: true,
							translateTime: 'yyyy-mm-dd HH:MM:ss',
							ignore: 'pid,hostname',
							singleLine: true,
						},
					}
				: undefined,
		level: process.env.LOG_LEVEL || 'info',
		customProps: () => ({
			context: 'HTTP',
		}),
		serializers: {
			req: (req: FastifyRequest) => ({
				method: req.method,
				url: req.url,
				query: req.query,
				params: req.params,
			}),
			res: (res: FastifyReply) => ({
				statusCode: res.statusCode,
			}),
		},
		autoLogging: {
			ignore: req => req.url === '/api/v1/health',
		},
		...(process.env.NODE_ENV === 'production' && {
			formatters: {
				level: (label: string) => ({ level: label }),
			},
			timestamp: () => `,"time":"${new Date().toISOString()}"`,
		}),
	},
	exclude: ['/api/v1/health'],
};

export const pinoFileConfig = {
	errorLog: join(process.cwd(), 'logs', 'error.log'),
	combinedLog: join(process.cwd(), 'logs', 'combined.log'),
};
