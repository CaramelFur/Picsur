import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../config/early/earlyconfig.module';
import { MultiPartPipe } from './multipart.pipe';
import { PostFilePipe } from './postfile.pipe';

@Module({
  imports: [EarlyConfigModule],
  providers: [MultiPartPipe, PostFilePipe],
  exports: [MultiPartPipe, PostFilePipe, EarlyConfigModule],
})
export class DecoratorsModule {
}
