import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../../../config/early/early-config.module';
import { UsageManagerModule } from '../../../managers/usage/usage.module';
import { InfoController } from './info.controller';

@Module({
  imports: [EarlyConfigModule, UsageManagerModule],
  controllers: [InfoController],
})
export class InfoModule {}
