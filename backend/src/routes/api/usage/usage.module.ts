import { Module } from '@nestjs/common';
import { LateConfigModule } from '../../../config/late/late-config.module.js';
import { UsageController } from './usage.controller.js';

@Module({
  imports: [LateConfigModule],
  controllers: [UsageController],
})
export class UsageApiModule {}
