import { Module } from '@nestjs/common';
import { PicsurConfigModule } from '../config/config.module';
import { PicsurLoggerService } from './logger.service';

@Module({
  imports: [PicsurConfigModule],
  providers: [PicsurLoggerService],
  exports: [PicsurLoggerService],
})
export class PicsurLoggerModule {}
