import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { AppConfigService } from '@/config';
import * as schema from './schemas';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
	private readonly logger = new Logger(DatabaseService.name);

	private readonly client: ReturnType<typeof postgres>;
	public readonly query: PostgresJsDatabase<typeof schema>;

	constructor(private readonly config: AppConfigService) {
		this.client = postgres({
			host: config.database.host,
			port: config.database.port,
			user: config.database.user,
			password: config.database.password,
			database: config.database.database,
			ssl: config.database.ssl,
			max: config.database.max,
			idle_timeout: config.database.idleTimeout,
			connect_timeout: config.database.connectTimeout,
		});

		this.query = drizzle(this.client, {
			schema,
			logger: config.app.nodeEnv !== 'production',
		});

		this.logger.log('Database initialized');
	}

	async transaction<T>(fn: (tx: PostgresJsDatabase<typeof schema>) => Promise<T>): Promise<T> {
		return this.query.transaction(fn);
	}

	async onModuleDestroy() {
		this.logger.log('Closing database connection');
		await this.client.end();
	}
}
