import { Module } from '@nestjs/common';
import { PreferenceDbModule } from '../../../collections/preference-db/preference-db.module.js';
import { SysPrefController } from './sys-pref.controller.js';
import { UsrPrefController } from './usr-pref.controller.js';

@Module({
  imports: [PreferenceDbModule],
  controllers: [SysPrefController, UsrPrefController],
})
export class PrefModule {}
