import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../config/early/early-config.module';
import { ImageIdPipe } from './image-id/image-id.pipe';
import { MultiPartPipe } from './multipart/multipart.pipe';
import { PostFilePipe } from './multipart/postfile.pipe';

@Module({
  imports: [EarlyConfigModule],
  providers: [MultiPartPipe, PostFilePipe, ImageIdPipe],

  exports: [
    MultiPartPipe,
    PostFilePipe,
    ImageIdPipe,
    // EarlyConfigModule is exported here because the pipes are dependedant on the config
    // But these pipes dont resolve their dependencies via this module
    // So this way we force it to be "global"
    EarlyConfigModule,
  ],
})
export class DecoratorsModule {}
