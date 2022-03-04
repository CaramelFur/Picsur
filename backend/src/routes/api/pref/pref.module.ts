import { Module } from '@nestjs/common';
import { PrefController } from './pref.controller';

@Module({
  controllers: [PrefController]
})
export class PrefModule {}
