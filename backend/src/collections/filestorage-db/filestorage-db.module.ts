import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../../config/early/early-config.module';
import { FileStorageGeneric } from './filestorage-generic.service';

export const FSServiceToken = 'FileStorageService';

@Module({
  imports: [EarlyConfigModule],
  providers: [FileStorageGeneric],
  exports: [FileStorageGeneric],
})
export class FileStorageDBModule {}
