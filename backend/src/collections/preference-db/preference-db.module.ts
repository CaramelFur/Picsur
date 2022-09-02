import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarlyConfigModule } from '../../config/early/early-config.module';
import { ESysPreferenceBackend } from '../../database/entities/sys-preference.entity';
import { EUsrPreferenceBackend } from '../../database/entities/usr-preference.entity';
import { PreferenceCommonService } from './preference-common.service';
import { PreferenceDefaultsService } from './preference-defaults.service';
import { SysPreferenceDbService } from './sys-preference-db.service';
import { UsrPreferenceDbService } from './usr-preference-db.service';

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
