import { Module } from '@nestjs/common';
import { PreferenceDbModule } from '../../../collections/preference-db/preference-db.module';
import { SysPrefController } from './sys-pref.controller';
import { UsrPrefController } from './usr-pref.controller';

@Module({
  imports: [PreferenceDbModule],
  controllers: [SysPrefController, UsrPrefController],
})
export class PrefModule {}
