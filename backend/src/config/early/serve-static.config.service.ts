import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ServeStaticModuleOptions,
  ServeStaticModuleOptionsFactory
} from '@nestjs/serve-static';
import { join } from 'path';
import { EnvPrefix, PackageRoot } from '../config.static';

@Injectable()
export class ServeStaticConfigService
  implements ServeStaticModuleOptionsFactory
{
  private readonly logger = new Logger('ServeStaticConfigService');

  private defaultLocation = join(PackageRoot, '../frontend/dist');

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Static directory: ' + this.getStaticDirectory());
  }

  public getStaticDirectory(): string {
    const directory = this.configService.get<string>(
      `${EnvPrefix}STATIC_FRONTEND_ROOT`,
      this.defaultLocation,
    );
    return directory;
  }

  public createLoggerOptions(): ServeStaticModuleOptions[] {
    return [
      {
        rootPath: this.getStaticDirectory(),
      },
    ];
  }
}
