import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { DbModule } from './db/db.module';
import { ToursModule } from './tours/tours.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .required()
                    .valid('development', 'production')
                    .default('development'),
                PORT: Joi.number().required().default(3000),
                DATABASE_URL: Joi.string().required(),
                DATABASE_AUTH_TOKEN: Joi.string().required(),
            }),
        }),
        ToursModule,
        DbModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
