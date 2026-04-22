import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { AppConfigService } from '@/config';

type RedisClientName = 'default' | 'queue' | 'pub';

@Injectable()
export class RedisService implements OnModuleDestroy {
	private readonly logger = new Logger(RedisService.name);

	private readonly clients: Record<RedisClientName, Redis>;

	constructor(private readonly config: AppConfigService) {
		this.clients = {
			default: this.createClient(config.redis),
			queue: this.createClient({
				...config.redis,
				maxRetriesPerRequest: null, // BullMQ 必须
			}),
			pub: this.createClient({
				...config.redis,
				enableReadyCheck: false, // pub/sub 优化
			}),
		};
	}

	private createClient(options: RedisOptions): Redis {
		const client = new Redis(options);

		client.on('connect', () => {
			this.logger.log(`Redis connected: ${options.host}:${options.port}`);
		});

		client.on('error', err => {
			this.logger.error(`Redis error: ${err.message}`);
		});

		client.on('reconnecting', () => {
			this.logger.warn('Redis reconnecting...');
		});

		return client;
	}

	getClient(name: RedisClientName = 'default'): Redis {
		const client = this.clients[name];

		if (!client) {
			throw new Error(`Redis client "${name}" not found`);
		}

		return client;
	}

	async onModuleDestroy() {
		await Promise.all(
			Object.entries(this.clients).map(async ([name, client]) => {
				this.logger.log(`Closing Redis: ${name}`);
				await client.quit();
			}),
		);
	}
}
