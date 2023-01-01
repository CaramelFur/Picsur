import { Module } from '@nestjs/common';
import { LateConfigModule } from '../../config/late/late-config.module';
import { FileStorageGeneric } from './filestorage-generic.service';

export const FSServiceToken = 'FileStorageService';

@Module({
  imports: [LateConfigModule],
  providers: [FileStorageGeneric],
  exports: [FileStorageGeneric],
})
export class FileStorageDBModule {}
