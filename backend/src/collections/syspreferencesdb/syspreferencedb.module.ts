import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ESysPreferenceBackend } from '../../models/entities/syspreference.entity';
import { SysPreferenceService } from './syspreferencedb.service';

@Module({
  imports: [TypeOrmModule.forFeature([ESysPreferenceBackend])],
  providers: [SysPreferenceService],
  exports: [SysPreferenceService],
})
export class UsersModule {}
