import { Module } from '@nestjs/common';
import { LateConfigModule } from '../../../config/late/late-config.module';
import { InfoController } from './info.controller';

@Module({
  imports: [LateConfigModule],
  controllers: [InfoController],
})
export class InfoModule {}
