import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ESystemStateBackend } from '../../database/entities/system/system-state.entity.js';
import { SystemStateDbService } from './system-state-db.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ESystemStateBackend])],
  providers: [SystemStateDbService],
  exports: [SystemStateDbService],
})
export class SystemStateDbModule {}
