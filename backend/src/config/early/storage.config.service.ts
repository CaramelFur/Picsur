import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseString } from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix } from '../config.static.js';
import { HostConfigService } from './host.config.service.js';

export enum StorageTarget {
  DATABASE = 'DATABASE',
  LOCAL = 'LOCAL',
  S3 = 'S3',
}

@Injectable()
export class StorageConfigService {
  private readonly logger = new Logger(StorageConfigService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly hostConfigService: HostConfigService,
  ) {
    this.logger.log('Storage Target: ' + this.getStorageTarget());

    this.logger.log('Local Storage Path: ' + this.getLocalStoragePath());
  }

  public getStorageTarget(): StorageTarget {
    const target = ParseString(
      this.configService.get(`${EnvPrefix}STORAGE_TARGET`),
      StorageTarget.S3,
    ) as StorageTarget;
    // Ensure the location is valid
    if (Object.values(StorageTarget).includes(target)) {
      return target as StorageTarget;
    }
    return StorageTarget.DATABASE;
  }

  public getLocalStoragePath(): string {
    return ParseString(
      this.configService.get(`${EnvPrefix}LOCAL_STORAGE_PATH`),
      this.hostConfigService.isProduction() ? '/data' : './data',
    );
  }
}
