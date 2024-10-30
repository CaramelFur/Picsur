import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarlyConfigModule } from '../../config/early/early-config.module.js';
import { ESysPreferenceBackend } from '../../database/entities/system/sys-preference.entity.js';
import { EUsrPreferenceBackend } from '../../database/entities/system/usr-preference.entity.js';
import { PreferenceCommonService } from './preference-common.service.js';
import { PreferenceDefaultsService } from './preference-defaults.service.js';
import { SysPreferenceDbService } from './sys-preference-db.service.js';
import { UsrPreferenceDbService } from './usr-preference-db.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ESysPreferenceBackend, EUsrPreferenceBackend]),
    EarlyConfigModule,
  ],
  providers: [
    SysPreferenceDbService,
    UsrPreferenceDbService,
    PreferenceDefaultsService,
    PreferenceCommonService,
  ],
  exports: [SysPreferenceDbService, UsrPreferenceDbService],
})
export class PreferenceDbModule {}
