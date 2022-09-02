import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EApiKeyBackend } from '../../database/entities/apikey.entity';
import { ApikeyDbService } from './apikey-db.service';

@Module({
  imports: [TypeOrmModule.forFeature([EApiKeyBackend])],
  providers: [ApikeyDbService],
  exports: [ApikeyDbService],
})
export class ApikeyDbModule {}
