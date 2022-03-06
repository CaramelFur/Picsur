import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PicsurConfigModule } from '../../config/config.module';
import { ESysPreferenceBackend } from '../../models/entities/syspreference.entity';
import { SysPreferenceService } from './syspreferencedb.service';
import { SysPreferenceDefaultsService } from './syspreferencedefaults.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ESysPreferenceBackend]),
    PicsurConfigModule,
  ],
  providers: [SysPreferenceService, SysPreferenceDefaultsService],
  exports: [SysPreferenceService],
})
export class SysPreferenceModule {}
