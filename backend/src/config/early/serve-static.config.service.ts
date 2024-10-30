import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ServeStaticModuleOptions,
    ServeStaticModuleOptionsFactory,
} from '@nestjs/serve-static';
import { join } from 'path';
import { ParseString } from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix, PackageRoot } from '../config.static.js';

@Injectable()
export class ServeStaticConfigService
  implements ServeStaticModuleOptionsFactory
{
  private readonly logger = new Logger(ServeStaticConfigService.name);

  private defaultLocation = join(PackageRoot, '../frontend/dist');

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Static directory: ' + this.getStaticDirectory());
  }

  public getStaticDirectory(): string {
    return ParseString(
      this.configService.get(
        `${EnvPrefix}STATIC_FRONTEND_ROOT`,
        this.defaultLocation,
      ),
    );
  }

  public createLoggerOptions(): ServeStaticModuleOptions[] {
    return [
      {
        rootPath: this.getStaticDirectory(),
      },
    ];
  }
}
