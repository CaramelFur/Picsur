import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DecodedUsrPref,
  PrefValueType,
  PrefValueTypeStrings
} from 'picsur-shared/dist/dto/preferences.dto';
import { UsrPreference } from 'picsur-shared/dist/dto/usrpreferences.dto';
import { EUsrPreferenceSchema } from 'picsur-shared/dist/entities/usrpreference';
import {
  AsyncFailable,
  Fail,
  Failable,
  HasFailed
} from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import {
  UsrPreferenceList,
  UsrPreferenceValueTypes
} from '../../models/dto/usrpreferences.dto';
import { EUsrPreferenceBackend } from '../../models/entities/usrpreference.entity';
import { PreferenceDefaultsService } from './preferencedefaults.service';

@Injectable()
export class UsrPreferenceService {
  private readonly logger = new Logger('UsrPreferenceService');

  constructor(
    @InjectRepository(EUsrPreferenceBackend)
    private sysPreferenceRepository: Repository<EUsrPreferenceBackend>,
    private defaultsService: PreferenceDefaultsService,
  ) {}

  public async setPreference(
    key: string,
    value: PrefValueType,
  ): AsyncFailable<DecodedUsrPref> {
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
      type: UsrPreferenceValueTypes[key as UsrPreference],
      user: '',
    };
  }

  public async getPreference(key: string): AsyncFailable<DecodedUsrPref> {
    // Validate
    let validatedKey = this.validatePrefKey(key);
    if (HasFailed(validatedKey)) return validatedKey;

    // Fetch
    let foundSysPreference: EUsrPreferenceBackend | null;
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
    const result = EUsrPreferenceSchema.safeParse(foundSysPreference);
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

  public async getAllPreferences(): AsyncFailable<DecodedUsrPref[]> {
    // TODO: We are fetching each value invidually, we should fetch all at once
    let internalSysPrefs = await Promise.all(
      UsrPreferenceList.map((key) => this.getPreference(key)),
    );
    if (internalSysPrefs.some((pref) => HasFailed(pref))) {
      return Fail('Could not get all preferences');
    }

    return internalSysPrefs as DecodedUsrPref[];
  }

  // Private

  private async saveDefault(
    key: UsrPreference, // Force enum here because we dont validate
  ): AsyncFailable<DecodedUsrPref> {
    return this.setPreference(key, this.defaultsService.sysDefaults[key]());
  }

  // This converts the raw string representation of the value to the correct type
  private retrieveConvertedValue(
    preference: EUsrPreferenceBackend,
  ): Failable<DecodedUsrPref> {
    const key = this.validatePrefKey(preference.key);
    if (HasFailed(key)) return key;

    const type = UsrPreferenceValueTypes[key];
    switch (type) {
      case 'string':
        return {
          key: preference.key,
          value: preference.value,
          type: 'string',
          user: '',
        };
      case 'number':
        return {
          key: preference.key,
          value: parseInt(preference.value, 10),
          type: 'number',
          user: '',
        };
      case 'boolean':
        return {
          key: preference.key,
          value: preference.value == 'true',
          type: 'boolean',
          user: '',
        };
    }

    return Fail('Invalid preference value');
  }

  private async validatePref(
    key: string,
    value: PrefValueType,
  ): AsyncFailable<EUsrPreferenceBackend> {
    const validatedKey = this.validatePrefKey(key);
    if (HasFailed(validatedKey)) return validatedKey;

    const validatedValue = this.validatePrefValue(validatedKey, value);
    if (HasFailed(validatedValue)) return validatedValue;

    let verifySysPreference = new EUsrPreferenceBackend();
    verifySysPreference.key = validatedKey;
    verifySysPreference.value = validatedValue;

    // It should already be valid, but these two validators might go out of sync
    const result = EUsrPreferenceSchema.safeParse(verifySysPreference);
    if (!result.success) {
      this.logger.warn(result.error);
      return Fail('Invalid preference');
    }

    return result.data;
  }

  private validatePrefKey(key: string): Failable<UsrPreference> {
    if (!UsrPreferenceList.includes(key)) return Fail('Invalid preference key');

    return key as UsrPreference;
  }

  private validatePrefValue(
    // Key is required, because the type of the value depends on the key
    key: UsrPreference,
    value: PrefValueType,
  ): Failable<string> {
    const expectedType = UsrPreferenceValueTypes[key];

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
