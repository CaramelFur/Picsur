import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvPrefix } from './config.static';

@Injectable()
export class HostConfigService {
  private readonly logger = new Logger('HostConfigService');

  constructor(private configService: ConfigService) {
    this.logger.debug('Host: ' + this.getHost());
    this.logger.debug('Port: ' + this.getPort());
    this.logger.debug('Demo: ' + this.isDemo());
    this.logger.debug('Demo Interval: ' + this.getDemoInterval() / 1000 + 's');
  }

  public getHost(): string {
    const host = this.configService.get<string>(`${EnvPrefix}HOST`, '0.0.0.0');
    return host;
  }

  public getPort(): number {
    const port = this.configService.get<number>(`${EnvPrefix}PORT`, 8080);
    return port;
  }

  public isDemo() {
    const enabled = this.configService.get<boolean>(`${EnvPrefix}DEMO`, false);
    return enabled;
  }

  public getDemoInterval() {
    const interval = this.configService.get<number>(
      `${EnvPrefix}DEMO_INTERVAL`,
      1000 * 60 * 5,
    );
    return interval;
  }

  public isProduction() {
    const enabled = this.configService.get<boolean>(
      `${EnvPrefix}PRODUCTION`,
      false,
    );
    return enabled;
  }

  public getVersion() {
    const version = this.configService.get<string>(
      `npm_package_version`,
      '0.0.0',
    );
    return version;
  }
}
