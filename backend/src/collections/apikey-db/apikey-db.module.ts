import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EApiKeyBackend } from '../../database/entities/apikey.entity';
import { ApiKeyDbService } from './apikey-db.service';

@Module({
  imports: [TypeOrmModule.forFeature([EApiKeyBackend])],
  providers: [ApiKeyDbService],
  exports: [ApiKeyDbService],
})
export class ApiKeyDbModule {}
