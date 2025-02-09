import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { sql } from 'drizzle-orm';

import { DrizzleDB } from './db.module';

@Injectable()
export class DBHealthIndicator {
    constructor(
        @Inject('DrizzleAsyncProvider') private readonly db: DrizzleDB,
        private readonly healthIndicatorService: HealthIndicatorService,
    ) {}

    async isHealthy(key: string) {
        const indicator = this.healthIndicatorService.check(key);

        try {
            const statement = sql`SELECT 1`;
            await this.db.get(statement);

            return indicator.up();
        } catch (err: unknown) {
            console.error(err);
            return indicator.down('Database connection failed');
        }
    }
}
