import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DecodedSysPref,
  PrefValueType,
  PrefValueTypeStrings
} from 'picsur-shared/dist/dto/preferences.dto';
import { SysPreference } from 'picsur-shared/dist/dto/syspreferences.dto';
import { ESysPreferenceSchema } from 'picsur-shared/dist/entities/syspreference.entity';
import {
  AsyncFailable,
  Fail,
  Failable,
  HasFailed
} from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import {
  SysPreferenceList,
  SysPreferenceValueTypes
} from '../../models/dto/syspreferences.dto';
import { ESysPreferenceBackend } from '../../models/entities/syspreference.entity';
import { PreferenceDefaultsService } from './syspreferencedefaults.service';

@Injectable()
export class SysPreferenceService {
  private readonly logger = new Logger('SysPreferenceService');

  constructor(
    @InjectRepository(ESysPreferenceBackend)
    private sysPreferenceRepository: Repository<ESysPreferenceBackend>,
    private defaultsService: PreferenceDefaultsService,
  ) {}

  public async setPreference(
    key: string,
    value: PrefValueType,
  ): AsyncFailable<DecodedSysPref> {
    // Validate
    let sysPreference = await this.validatePref(key, value);
    if (HasFailed(sysPreference)) return sysPreference;

    // Set
    try {
      // Upsert here, because we want to create a new record if it does not exist
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

  public async getPreference(key: string): AsyncFailable<DecodedSysPref> {
    // Validate
    let validatedKey = this.validatePrefKey(key);
    if (HasFailed(validatedKey)) return validatedKey;

    // Fetch
    let foundSysPreference: ESysPreferenceBackend | null;
    try {
      foundSysPreference = await this.sysPreferenceRepository.findOne({
        where: { key: validatedKey },
        cache: 60000,
      });
    } catch (e: any) {
      this.logger.warn(e);
      return Fail('Could not get preference');
    }

    // Fallback
    if (!foundSysPreference) {
      return this.saveDefault(validatedKey);
    }

    // Validate
    const result = ESysPreferenceSchema.safeParse(foundSysPreference);
    if (!result.success) {
      this.logger.warn(result.error);
      return Fail('Invalid preference');
    }

    // Return
    return this.retrieveConvertedValue(result.data);
  }

  public async getStringPreference(key: string): AsyncFailable<string> {
    return this.getPreferencePinned(key, 'string') as AsyncFailable<string>;
  }

  public async getNumberPreference(key: string): AsyncFailable<number> {
    return this.getPreferencePinned(key, 'number') as AsyncFailable<number>;
  }

  public async getBooleanPreference(key: string): AsyncFailable<boolean> {
    return this.getPreferencePinned(key, 'boolean') as AsyncFailable<boolean>;
  }

  private async getPreferencePinned(
    key: string,
    type: PrefValueTypeStrings,
  ): AsyncFailable<PrefValueType> {
    let pref = await this.getPreference(key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== type) return Fail('Invalid preference type');

    return pref.value;
  }

  public async getAllPreferences(): AsyncFailable<DecodedSysPref[]> {
    // TODO: We are fetching each value invidually, we should fetch all at once
    let internalSysPrefs = await Promise.all(
      SysPreferenceList.map((key) => this.getPreference(key)),
    );
    if (internalSysPrefs.some((pref) => HasFailed(pref))) {
      return Fail('Could not get all preferences');
    }

    return internalSysPrefs as DecodedSysPref[];
  }

  // Private

  private async saveDefault(
    key: SysPreference, // Force enum here because we dont validate
  ): AsyncFailable<DecodedSysPref> {
    return this.setPreference(key, this.defaultsService.sysDefaults[key]());
  }

  // This converts the raw string representation of the value to the correct type
  private retrieveConvertedValue(
    preference: ESysPreferenceBackend,
  ): Failable<DecodedSysPref> {
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
    value: PrefValueType,
  ): AsyncFailable<ESysPreferenceBackend> {
    const validatedKey = this.validatePrefKey(key);
    if (HasFailed(validatedKey)) return validatedKey;

    const validatedValue = this.validatePrefValue(validatedKey, value);
    if (HasFailed(validatedValue)) return validatedValue;

    let verifySysPreference = new ESysPreferenceBackend();
    verifySysPreference.key = validatedKey;
    verifySysPreference.value = validatedValue;

    // It should already be valid, but these two validators might go out of sync
    const result = ESysPreferenceSchema.safeParse(verifySysPreference);
    if (!result.success) {
      this.logger.warn(result.error);
      return Fail('Invalid preference');
    }

    return result.data;
  }

  private validatePrefKey(key: string): Failable<SysPreference> {
    if (!SysPreferenceList.includes(key)) return Fail('Invalid preference key');

    return key as SysPreference;
  }

  private validatePrefValue(
    // Key is required, because the type of the value depends on the key
    key: SysPreference,
    value: PrefValueType,
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
