import { Module } from '@nestjs/common';
import { PicsurConfigModule } from '../config/config.module';
import { MultiPartPipe } from './multipart.pipe';
import { PostFilePipe } from './postfile.pipe';

@Module({
  imports: [PicsurConfigModule],
  providers: [MultiPartPipe, PostFilePipe],
  exports: [MultiPartPipe, PostFilePipe, PicsurConfigModule],
})
export class DecoratorsModule {
}
