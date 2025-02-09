import { createClient } from '@libsql/client';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';

import { HealthIndicatorService, TerminusModule } from '@nestjs/terminus';
import { AppConfigService } from 'src/app-config/app-config.service';
import { DBHealthIndicator } from './db.health';
import * as schema from './schemas';

export type DrizzleDB = LibSQLDatabase<typeof schema>;

@Module({
    imports: [TerminusModule],
    providers: [
        {
            provide: 'DrizzleAsyncProvider',
            inject: [ConfigService],
            useFactory: (configService: AppConfigService) => {
                const client = createClient({
                    url: configService.get('DATABASE_URL'),
                    authToken: configService.get('DATABASE_AUTH_TOKEN'),
                });

                return drizzle({ client, schema, logger: true });
            },
        },
        HealthIndicatorService,
        DBHealthIndicator,
    ],
    exports: ['DrizzleAsyncProvider', DBHealthIndicator],
})
export class DbModule {}
