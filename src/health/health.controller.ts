import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
} from '@nestjs/terminus';

import { AppConfigService } from 'src/app-config/app-config.service';
import { DBHealthIndicator } from 'src/db/db.health';

@Controller({
    path: 'health',
    version: VERSION_NEUTRAL,
})
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private memory: MemoryHealthIndicator,
        private disk: DiskHealthIndicator,
        private appConfig: AppConfigService,
        private dbHealth: DBHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('api', this.appConfig.get('APP_BASE_URL') + '/health/status'),
            () => this.dbHealth.isHealthy('database'),
            () => this.memory.checkHeap('heap', 150 * 1024 * 1024), // 150MB
            () => this.memory.checkRSS('rss', 300 * 1024 * 1024), // 300MB
            () => this.disk.checkStorage('storage', { thresholdPercent: 0.99, path: '/' }),
        ]);
    }

    @Get('status')
    status() {
        return { status: 'ok' };
    }
}
