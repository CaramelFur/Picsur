import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EIngestFileBackend } from '../../database/entities/ingest-file.entity';
import { IngestFileDbService } from './ingest-file-db.service';

@Module({
  imports: [TypeOrmModule.forFeature([EIngestFileBackend])],
  providers: [IngestFileDbService],
  exports: [IngestFileDbService],
})
export class IngestFileDbModule {}
