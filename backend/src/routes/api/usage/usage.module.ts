import { Module } from '@nestjs/common';
import { UsageManagerModule } from '../../../managers/usage/usage.module';
import { UsageController } from './usage.controller';

@Module({
  imports: [UsageManagerModule],
  controllers: [UsageController],
})
export class UsageApiModule {}
