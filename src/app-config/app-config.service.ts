import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './env.schema';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService<AppConfig, true>) {}

    get<T extends keyof AppConfig>(key: T) {
        return this.configService.get(key, { infer: true });
    }
}
