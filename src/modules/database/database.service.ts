import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { AppConfigService } from '@/config';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
	private readonly logger = new Logger(DatabaseService.name);

	private readonly client: ReturnType<typeof postgres>;
	public readonly query: PostgresJsDatabase;

	constructor(private readonly config: AppConfigService) {
		this.client = postgres({
			host: config.database.host,
			port: config.database.port,
			username: config.database.username,
			password: config.database.password,
			database: config.database.database,
			ssl: config.database.ssl,
		});

		this.query = drizzle(this.client);
	}

	async onModuleDestroy() {
		this.logger.log('Closing database connection');
		await this.client.end();
	}
}
