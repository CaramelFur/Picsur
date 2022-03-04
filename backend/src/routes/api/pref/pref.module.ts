import { Module } from '@nestjs/common';
import { SysPreferenceModule } from '../../../collections/syspreferencesdb/syspreferencedb.module';
import { PrefController } from './pref.controller';

@Module({
  imports: [SysPreferenceModule],
  controllers: [PrefController]
})
export class PrefModule {}
