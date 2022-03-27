import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import {
  InternalSysprefRepresentation,
  SysPreference,
  SysPrefValueType
} from 'picsur-shared/dist/dto/syspreferences.dto';
import {
  AsyncFailable,
  Fail,
  Failable,
  HasFailed
} from 'picsur-shared/dist/types';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { Repository } from 'typeorm';
import {
  SysPreferenceList,
  SysPreferenceValueTypes
} from '../../models/dto/syspreferences.dto';
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
    key: string,
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
      key: sysPreference.key,
      value,
      // key has to be valid here, we validated it
      type: SysPreferenceValueTypes[key as SysPreference],
    };
  }

  public async getPreference(
    key: string,
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
      const errors = await strictValidate(foundSysPreference);
      if (errors.length > 0) {
        this.logger.warn(errors);
        return Fail('Invalid preference');
      }
    }

    // Return
    return this.retrieveConvertedValue(foundSysPreference);
  }

  public async getStringPreference(key: string): AsyncFailable<string> {
    const pref = await this.getPreference(key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== 'string') return Fail('Invalid preference type');

    return pref.value as string;
  }

  public async getNumberPreference(key: string): AsyncFailable<number> {
    const pref = await this.getPreference(key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== 'number') return Fail('Invalid preference type');

    return pref.value as number;
  }

  public async getBooleanPreference(key: string): AsyncFailable<boolean> {
    const pref = await this.getPreference(key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== 'boolean') return Fail('Invalid preference type');

    return pref.value as boolean;
  }

  public async getAllPreferences(): AsyncFailable<
    InternalSysprefRepresentation[]
  > {
    let internalSysPrefs = await Promise.all(
      SysPreferenceList.map((key) => this.getPreference(key)),
    );
    if (internalSysPrefs.some((pref) => HasFailed(pref))) {
      return Fail('Could not get all preferences');
    }

    return internalSysPrefs as InternalSysprefRepresentation[];
  }
  // Private

  private async saveDefault(
    key: SysPreference, // Force enum here because we dont validate
  ): AsyncFailable<InternalSysprefRepresentation> {
    return this.setPreference(key, this.defaultsService.defaults[key]());
  }

  private retrieveConvertedValue(
    preference: ESysPreferenceBackend,
  ): Failable<InternalSysprefRepresentation> {
    const key = this.validatePrefKey(preference.key);
    if (HasFailed(key)) return key;

    const type = SysPreferenceValueTypes[key];
    switch (type) {
      case 'string':
        return {
          key: preference.key,
          value: preference.value,
          type: 'string',
        };
      case 'number':
        return {
          key: preference.key,
          value: parseInt(preference.value, 10),
          type: 'number',
        };
      case 'boolean':
        return {
          key: preference.key,
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
    const errors = await strictValidate(verifySysPreference);
    if (errors.length > 0) {
      this.logger.warn(errors);
      return Fail('Invalid preference');
    }

    return verifySysPreference;
  }

  private validatePrefKey(key: string): Failable<SysPreference> {
    if (!SysPreferenceList.includes(key)) {
      return Fail('Invalid preference key');
    }

    return key as SysPreference;
  }

  private validatePrefValue(
    key: SysPreference,
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
