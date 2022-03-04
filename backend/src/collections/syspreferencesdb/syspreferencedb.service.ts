import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { SysPreferences } from 'picsur-shared/dist/dto/syspreferences.dto';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { SysPreferenceDefaults } from '../../models/dto/syspreference.dto';
import { ESysPreferenceBackend } from '../../models/entities/syspreference.entity';

@Injectable()
export class SysPreferenceService {
  private readonly logger = new Logger('SysPreferenceService');

  constructor(
    @InjectRepository(ESysPreferenceBackend)
    private sysPreferenceRepository: Repository<ESysPreferenceBackend>,
  ) {}

  public async setPreference(
    key: SysPreferences,
    value: string,
  ): AsyncFailable<ESysPreferenceBackend> {
    let sysPreference = new ESysPreferenceBackend();
    sysPreference.key = key;
    sysPreference.value = value;

    const errors = await validate(sysPreference);
    if (errors.length > 0) {
      this.logger.warn(errors);
      return Fail('Invalid preference');
    }

    try {
      sysPreference = await this.sysPreferenceRepository.save(sysPreference, {
        reload: true,
      });
    } catch (e: any) {
      this.logger.warn(e);
      return Fail('Could not save preference');
    }

    return sysPreference;
  }

  public async getPreference(
    key: SysPreferences,
  ): AsyncFailable<ESysPreferenceBackend> {
    let sysPreference: ESysPreferenceBackend | undefined;
    try {
      sysPreference = await this.sysPreferenceRepository.findOne({
        key,
      });
    } catch (e: any) {
      this.logger.warn(e);
      return Fail('Could not get preference');
    }

    if (!sysPreference) {
      return this.saveDefault(key);
    }

    return sysPreference;
  }

  private async saveDefault(
    key: SysPreferences,
  ): AsyncFailable<ESysPreferenceBackend> {
    return this.setPreference(key, SysPreferenceDefaults[key]());
  }
}
