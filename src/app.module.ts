import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigModule } from './app-config/app-config.module';
import { envSchema } from './app-config/env.schema';
import { DbModule } from './db/db.module';
import { ToursModule } from './tours/tours.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (env) => envSchema.parse(env),
        }),
        ToursModule,
        DbModule,
        AppConfigModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
