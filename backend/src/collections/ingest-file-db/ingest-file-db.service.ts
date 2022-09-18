import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail, FT } from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { EIngestFileBackend } from '../../database/entities/ingest-file.entity';

@Injectable()
export class IngestFileDbService {
  private readonly logger = new Logger(IngestFileDbService.name);

  constructor(
    @InjectRepository(EIngestFileBackend)
    private readonly ingressFileRepo: Repository<EIngestFileBackend>,
  ) {}

  public async uploadFile(
    filename: string,
    file: Buffer,
  ): AsyncFailable<string> {
    const ingressFile = new EIngestFileBackend();
    ingressFile.filename = filename;
    ingressFile.data = file;

    try {
      await this.ingressFileRepo.save(ingressFile);
    } catch (e) {
      return Fail(FT.Database, e);
    }

    return ingressFile.id;
  }
}
