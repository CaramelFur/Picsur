import { Module } from '@nestjs/common';
import { EarlyConfigModule } from '../../../config/early/early-config.module';
import { InfoController } from './info.controller';

@Module({
  imports: [EarlyConfigModule],
  controllers: [InfoController],
})
export class InfoModule {}
