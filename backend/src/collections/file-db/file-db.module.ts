import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../../config/early/early-config.module.js';
import { FileS3Service } from './file-db-s3.service.js';

@Module({
  imports: [EarlyConfigModule],
  providers: [FileS3Service],
  exports: [FileS3Service],
})
export class FileDBModule {}
