import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigModule } from './app-config/app-config.module';
import { envSchema } from './app-config/env.schema';
import { DbModule } from './db/db.module';
import { ToursModule } from './tours/tours.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (env) => envSchema.parse(env),
        }),
        AppConfigModule,
        ToursModule,
        DbModule,
        HealthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
