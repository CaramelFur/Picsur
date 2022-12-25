import { Module } from '@nestjs/common';
import { LateConfigModule } from '../../../config/late/late-config.module';
import { UsageController } from './usage.controller';

@Module({
  imports: [LateConfigModule],
  controllers: [UsageController],
})
export class UsageApiModule {}
