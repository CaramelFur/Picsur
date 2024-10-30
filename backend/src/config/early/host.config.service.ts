import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ParseBool,
    ParseInt,
    ParseString,
} from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix } from '../config.static.js';

@Injectable()
export class HostConfigService {
  private readonly logger = new Logger(HostConfigService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Production: ' + this.isProduction());
    this.logger.log('Verbose: ' + this.isVerbose());
    this.logger.log('Location: http://' + this.getHost() + ":" + this.getPort());

    if (this.isDemo()) {
      this.logger.log('Running in demo mode');
      this.logger.log('Demo Interval: ' + this.getDemoInterval() / 1000 + 's');
    }

    if (!this.isTelemetry()) {
      this.logger.log('Telemetry disabled');
    }
  }

  public getHost(): string {
    return ParseString(this.configService.get(`${EnvPrefix}HOST`), '0.0.0.0');
  }

  public getPort(): number {
    return ParseInt(this.configService.get(`${EnvPrefix}PORT`), 8080);
  }

  public isDemo() {
    return ParseBool(this.configService.get(`${EnvPrefix}DEMO`), false);
  }

  public getDemoInterval() {
    return ParseInt(
      this.configService.get(`${EnvPrefix}DEMO_INTERVAL`),
      1000 * 60 * 5,
    );
  }

  public isProduction() {
    return ParseBool(this.configService.get(`${EnvPrefix}PRODUCTION`), false);
  }

  public isVerbose() {
    return ParseBool(this.configService.get(`${EnvPrefix}VERBOSE`), false);
  }

  public isTelemetry() {
    return ParseBool(this.configService.get(`${EnvPrefix}TELEMETRY`), true);
  }

  public getVersion() {
    return ParseString(this.configService.get(`npm_package_version`), '0.0.0');
  }
}
