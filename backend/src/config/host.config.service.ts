import { Injectable, Logger } from '@nestjs/common';
import {
  ServeStaticModuleOptions,
  ServeStaticModuleOptionsFactory,
} from '@nestjs/serve-static';
import { join } from 'path';
import { EnvPrefix, PackageRoot } from './config.static';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HostConfigService {
  private readonly logger = new Logger('HostConfigService');

  constructor(private configService: ConfigService) {}

  public getHost(): string {
    const host = this.configService.get<string>(`${EnvPrefix}HOST`, '0.0.0.0');
    this.logger.debug('Host: ' + host);
    return host;
  }

  public getPort(): number {
    const port = this.configService.get<number>(`${EnvPrefix}PORT`, 8080);
    this.logger.debug('Port: ' + port);
    return port;
  }

  public isDemo() {
    const enabled = this.configService.get<boolean>(`${EnvPrefix}_DEMO`, false);
    this.logger.debug('Demo enabled: ' + enabled);
    return enabled;
  }

  public getDemoInterval() {
    const interval = this.configService.get<number>(
      `${EnvPrefix}_DEMO_INTERVAL`,
      1000 * 60 * 5,
    );
    this.logger.debug('Demo interval: ' + interval);
    return interval;
  }
}
