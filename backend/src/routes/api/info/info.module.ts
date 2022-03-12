import { Module } from '@nestjs/common';
import { PicsurConfigModule } from '../../../config/config.module';
import { InfoController } from './info.controller';

@Module({
  imports: [PicsurConfigModule],
  controllers: [InfoController],
})
export class InfoModule {}
