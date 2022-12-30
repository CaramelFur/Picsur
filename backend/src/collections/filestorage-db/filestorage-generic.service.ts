import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AsyncFailable } from 'picsur-shared/dist/types';
import {
  FileStorageConfigService,
  FileStorageMode
} from '../../config/early/filestorage.config.service';
import { FileStorageEmpty } from './services/filestorage-empty';
import { FileStorageLocalService } from './services/filestorage-local';

import { FileStorageS3Service } from './services/filestorage-s3';
import { FileStorageService } from './services/filestorage-service';

@Injectable()
export class FileStorageGeneric implements OnModuleInit {
  private readonly logger = new Logger(FileStorageConfigService.name);
  private backingService: FileStorageService = new FileStorageEmpty();

  constructor(private readonly fsConfig: FileStorageConfigService) {}

  async onModuleInit() {
    const mode = this.fsConfig.getFileStorageMode();
    if (mode === FileStorageMode.Local) {
      this.backingService = new FileStorageLocalService(this.fsConfig);
    } else if (mode === FileStorageMode.S3) {
      this.backingService = new FileStorageS3Service(this.fsConfig);
    } else {}

    try {
      await this.backingService.onStorageInit();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async putFile(key: string, data: Buffer): AsyncFailable<string> {
    return this.backingService.putFile(key, data);
  }
  async getFile(key: string): AsyncFailable<Buffer> {
    return this.backingService.getFile(key);
  }
  async deleteFile(key: string): AsyncFailable<true> {
    return this.backingService.deleteFile(key);
  }
  async deleteFiles(keys: string[]): AsyncFailable<true> {
    return this.backingService.deleteFiles(keys);
  }
}
