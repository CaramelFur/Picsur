import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  InternalSysprefRepresentation,
  SysPreferences,
  SysPreferenceValueTypes,
  SysPrefValueType
} from 'picsur-shared/dist/dto/syspreferences.dto';
import {
  AsyncFailable,
  Fail,
  Failable,
  HasFailed
} from 'picsur-shared/dist/types';
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
    value: SysPrefValueType,
  ): AsyncFailable<InternalSysprefRepresentation> {
    // Validate
    let sysPreference = await this.validatePref(key, value);
    if (HasFailed(sysPreference)) return sysPreference;

    // Set
    try {
      await this.sysPreferenceRepository.upsert(sysPreference, {
        conflictPaths: ['key'],
      });
    } catch (e: any) {
      this.logger.warn(e);
      return Fail('Could not save preference');
    }

    // Return
    return {
      value,
      type: SysPreferenceValueTypes[key],
    };
  }

  public async getPreference(
    key: SysPreferences,
  ): AsyncFailable<InternalSysprefRepresentation> {
    // Validate
    let validatedKey = this.validatePrefKey(key);
    if (HasFailed(validatedKey)) return validatedKey;

    // Fetch
    let foundSysPreference: ESysPreferenceBackend | undefined;
    try {
      foundSysPreference = await this.sysPreferenceRepository.findOne(
        { key: validatedKey },
        { cache: 60000 },
      );
    } catch (e: any) {
      this.logger.warn(e);
      return Fail('Could not get preference');
    }

    // Fallback
    if (!foundSysPreference) {
      return this.saveDefault(validatedKey);
    } else {
      foundSysPreference = plainToClass(
        ESysPreferenceBackend,
        foundSysPreference,
      );
      const errors = await validate(foundSysPreference, {
        forbidUnknownValues: true,
      });
      if (errors.length > 0) {
        this.logger.warn(errors);
        return Fail('Invalid preference');
      }
    }

    // Return
    return this.retrieveConvertedValue(foundSysPreference);
  }

  public async getStringPreference(key: SysPreferences): AsyncFailable<string> {
    const pref = await this.getPreference(key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== 'string') return Fail('Invalid preference type');

    return pref.value as string;
  }

  public async getNumberPreference(key: SysPreferences): AsyncFailable<number> {
    const pref = await this.getPreference(key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== 'number') return Fail('Invalid preference type');

    return pref.value as number;
  }

  public async getBooleanPreference(
    key: SysPreferences,
  ): AsyncFailable<boolean> {
    const pref = await this.getPreference(key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== 'boolean') return Fail('Invalid preference type');

    return pref.value as boolean;
  }

  // Private

  private async saveDefault(
    key: SysPreferences,
  ): AsyncFailable<InternalSysprefRepresentation> {
    return this.setPreference(key, this.defaultsService.defaults[key]());
  }

  private retrieveConvertedValue(
    preference: ESysPreferenceBackend,
  ): Failable<InternalSysprefRepresentation> {
    const type = SysPreferenceValueTypes[preference.key];
    switch (type) {
      case 'string':
        return {
          value: preference.value,
          type: 'string',
        };
      case 'number':
        return {
          value: parseInt(preference.value, 10),
          type: 'number',
        };
      case 'boolean':
        return {
          value: preference.value == 'true',
          type: 'boolean',
        };
    }

    return Fail('Invalid preference value');
  }

  private async validatePref(
    key: string,
    value: SysPrefValueType,
  ): AsyncFailable<ESysPreferenceBackend> {
    const validatedKey = this.validatePrefKey(key);
    if (HasFailed(validatedKey)) return validatedKey;

    const validatedValue = this.validatePrefValue(validatedKey, value);
    if (HasFailed(validatedValue)) return validatedValue;

    let verifySysPreference = new ESysPreferenceBackend();
    verifySysPreference.key = validatedKey;
    verifySysPreference.value = validatedValue;

    // Just to be sure
    const errors = await validate(verifySysPreference, {
      forbidUnknownValues: true,
    });
    if (errors.length > 0) {
      this.logger.warn(errors);
      return Fail('Invalid preference');
    }

    return verifySysPreference;
  }

  private validatePrefKey(key: string): Failable<SysPreferences> {
    if (!SysPreferences.includes(key)) {
      return Fail('Invalid preference key');
    }

    return key as SysPreferences;
  }

  private validatePrefValue(
    key: SysPreferences,
    value: SysPrefValueType,
  ): Failable<string> {
    const expectedType = SysPreferenceValueTypes[key];

    const type = typeof value;
    if (type != expectedType) {
      return Fail('Invalid preference value');
    }

    switch (type) {
      case 'string':
        return value as string;
      case 'number':
        return value.toString();
      case 'boolean':
        return value ? 'true' : 'false';
    }

    return Fail('Invalid preference value');
  }
}
