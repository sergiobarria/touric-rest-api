import { createClient } from '@libsql/client';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';

import { AppConfigService } from 'src/app-config/app-config.service';
import * as schema from './schemas';

export const DrizzleAsyncProvider = Symbol('DrizzleAsyncProvider');

export type DrizzleDB = LibSQLDatabase<typeof schema>;

@Module({
    providers: [
        {
            provide: DrizzleAsyncProvider,
            inject: [ConfigService],
            useFactory: (configService: AppConfigService) => {
                const client = createClient({
                    url: configService.get('DATABASE_URL'),
                    authToken: configService.get('DATABASE_AUTH_TOKEN'),
                });

                return drizzle({ client, schema, logger: true });
            },
        },
    ],
    exports: [DrizzleAsyncProvider],
})
export class DbModule {}
