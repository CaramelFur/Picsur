import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarlyConfigModule } from '../../config/early/earlyconfig.module';
import { ESysPreferenceBackend } from '../../models/entities/syspreference.entity';
import { EUsrPreferenceBackend } from '../../models/entities/usrpreference.entity';
import { PreferenceCommonService } from './preferencecommon.service';
import { PreferenceDefaultsService } from './preferencedefaults.service';
import { SysPreferenceService } from './syspreferencedb.service';
import { UsrPreferenceService } from './usrpreferencedb.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ESysPreferenceBackend, EUsrPreferenceBackend]),
    EarlyConfigModule,
  ],
  providers: [
    SysPreferenceService,
    UsrPreferenceService,
    PreferenceDefaultsService,
    PreferenceCommonService,
  ],
  exports: [SysPreferenceService, UsrPreferenceService],
})
export class PreferenceModule {}
