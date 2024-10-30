import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../config/early/early-config.module.js';
import { PicsurLoggerService } from './logger.service.js';

@Module({
  imports: [EarlyConfigModule],
  providers: [PicsurLoggerService],
  exports: [PicsurLoggerService],
})
export class PicsurLoggerModule {}
