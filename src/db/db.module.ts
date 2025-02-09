import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';

import * as schema from './schemas';

export const DrizzleAsyncProvider = Symbol('DrizzleAsyncProvider');

export type DrizzleDB = LibSQLDatabase<typeof schema>;

@Module({
    providers: [
        {
            provide: DrizzleAsyncProvider,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const db = drizzle({
                    connection: {
                        url: configService.get<string>('DATABASE_URL') as string,
                        authToken: configService.get<string>('DATABASE_AUTH_TOKEN') as string,
                    },
                    logger: true,
                    schema,
                });

                return db;
            },
        },
    ],
    exports: [DrizzleAsyncProvider],
})
export class DbModule {}
