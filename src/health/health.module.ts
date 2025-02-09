import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AppConfigModule } from 'src/app-config/app-config.module';
import { DbModule } from 'src/db/db.module';
import { HealthController } from './health.controller';

@Module({
    imports: [TerminusModule, HttpModule, AppConfigModule, DbModule],
    controllers: [HealthController],
})
export class HealthModule {}
