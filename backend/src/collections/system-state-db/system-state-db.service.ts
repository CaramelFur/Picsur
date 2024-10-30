import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail, FT } from 'picsur-shared/dist/types/failable';
import { Repository } from 'typeorm';
import { ESystemStateBackend } from '../../database/entities/system/system-state.entity.js';

@Injectable()
export class SystemStateDbService {
  private readonly logger = new Logger(SystemStateDbService.name);

  constructor(
    @InjectRepository(ESystemStateBackend)
    private readonly stateRepo: Repository<ESystemStateBackend>,
  ) {}

  async get(key: string): AsyncFailable<string | null> {
    try {
      const state = await this.stateRepo.findOne({ where: { key } });
      return state?.value ?? null;
    } catch (err) {
      return Fail(FT.Database, err);
    }
  }

  async set(key: string, value: string): AsyncFailable<true> {
    try {
      await this.stateRepo.save({ key, value });
      return true;
    } catch (err) {
      return Fail(FT.Database, err);
    }
  }

  async clear(key: string): AsyncFailable<true> {
    try {
      await this.stateRepo.delete({ key });
      return true;
    } catch (err) {
      return Fail(FT.Database, err);
    }
  }
}
