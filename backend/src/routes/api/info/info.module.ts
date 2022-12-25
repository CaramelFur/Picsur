import { Module } from '@nestjs/common';
import { LateConfigModule } from '../../../config/late/late-config.module';
import { UsageManagerModule } from '../../../managers/usage/usage.module';
import { InfoController } from './info.controller';

@Module({
  imports: [LateConfigModule, UsageManagerModule],
  controllers: [InfoController],
})
export class InfoModule {}
