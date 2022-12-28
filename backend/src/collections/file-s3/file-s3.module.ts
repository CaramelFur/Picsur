import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../../config/early/early-config.module';
import { FileS3Service } from './file-s3.service';

@Module({
  imports: [EarlyConfigModule],
  providers: [FileS3Service],
  exports: [FileS3Service],
})
export class FileS3Module {}
