import { Module } from '@nestjs/common';
import { PreferenceModule } from '../../../collections/preferencesdb/preferencedb.module';
import { SysPrefController } from './syspref.controller';
import { UsrPrefController } from './usrpref.controller';

@Module({
  imports: [PreferenceModule],
  controllers: [SysPrefController, UsrPrefController],
})
export class PrefModule {}
