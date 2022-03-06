import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SysPreferences } from 'picsur-shared/dist/dto/syspreferences.dto';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { ESysPreferenceBackend } from '../../models/entities/syspreference.entity';
import { SysPreferenceDefaultsService } from './syspreferencedefaults.service';

@Injectable()
export class SysPreferenceService {
  private readonly logger = new Logger('SysPreferenceService');

  constructor(
    @InjectRepository(ESysPreferenceBackend)
    private sysPreferenceRepository: Repository<ESysPreferenceBackend>,
    private defaultsService: SysPreferenceDefaultsService,
  ) {}

  public async setPreference(
    key: SysPreferences,
    value: string,
  ): AsyncFailable<ESysPreferenceBackend> {
    let sysPreference = await this.validatePref(key, value);
    if (HasFailed(sysPreference)) return sysPreference;

    try {
      await this.sysPreferenceRepository.upsert(sysPreference, {
        conflictPaths: ['key'],
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
    let sysPreference = await this.validatePref(key);
    if (HasFailed(sysPreference)) return sysPreference;

    let foundSysPreference: ESysPreferenceBackend | undefined;
    try {
      foundSysPreference = await this.sysPreferenceRepository.findOne(
        { key: sysPreference.key },
        { cache: 60000 },
      );
    } catch (e: any) {
      this.logger.warn(e);
      return Fail('Could not get preference');
    }

    if (!foundSysPreference) {
      return this.saveDefault(sysPreference.key);
    } else {
      foundSysPreference = plainToClass(
        ESysPreferenceBackend,
        foundSysPreference,
      );
      const errors = await validate(foundSysPreference);
      if (errors.length > 0) {
        this.logger.warn(errors);
        return Fail('Invalid preference');
      }
    }

    return foundSysPreference;
  }

  private async saveDefault(
    key: SysPreferences,
  ): AsyncFailable<ESysPreferenceBackend> {
    return this.setPreference(key, this.defaultsService.defaults[key]());
  }

  private async validatePref(
    key: string,
    value: string = 'validate',
  ): AsyncFailable<ESysPreferenceBackend> {
    let verifySysPreference = new ESysPreferenceBackend();
    verifySysPreference.key = key as SysPreferences;
    verifySysPreference.value = value;

    const errors = await validate(verifySysPreference);
    if (errors.length > 0) {
      this.logger.warn(errors);
      return Fail('Invalid preference');
    }

    return verifySysPreference;
  }
}
