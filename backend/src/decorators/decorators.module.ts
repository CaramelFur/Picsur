import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../config/early/earlyconfig.module';
import { MultiPartPipe } from './multipart.pipe';
import { PostFilePipe } from './postfile.pipe';

@Module({
  imports: [EarlyConfigModule],
  providers: [MultiPartPipe, PostFilePipe],

  exports: [
    MultiPartPipe, 
    PostFilePipe, 
    // EarlyConfigModule is exported here because the pipes are dependedant on the config
    // But these pipes dont resolve their dependencies via this module
    // So this way we force it to be "global"
    EarlyConfigModule,
  ],
})
export class DecoratorsModule {}
