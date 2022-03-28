import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarlyConfigModule } from '../../config/early/earlyconfig.module';
import { ESysPreferenceBackend } from '../../models/entities/syspreference.entity';
import { SysPreferenceService } from './syspreferencedb.service';
import { SysPreferenceDefaultsService } from './syspreferencedefaults.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ESysPreferenceBackend]),
    EarlyConfigModule,
  ],
  providers: [SysPreferenceService, SysPreferenceDefaultsService],
  exports: [SysPreferenceService],
})
export class SysPreferenceModule {}
