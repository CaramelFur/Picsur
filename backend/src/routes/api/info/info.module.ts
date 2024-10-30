import { Module } from '@nestjs/common';
import { LateConfigModule } from '../../../config/late/late-config.module.js';
import { InfoController } from './info.controller.js';

@Module({
  imports: [LateConfigModule],
  controllers: [InfoController],
})
export class InfoModule {}
