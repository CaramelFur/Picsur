import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DecodedUsrPref,
  PrefValueType,
  PrefValueTypeStrings,
} from 'picsur-shared/dist/dto/preferences.dto';
import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.dto';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import {
  UsrPreferenceList,
  UsrPreferenceValueTypes,
} from '../../models/constants/usrpreferences.const';
import {
  EUsrPreferenceBackend,
  EUsrPreferenceSchema,
} from '../../models/entities/usr-preference.entity';
import { MutexFallBack } from '../../models/util/mutex-fallback';
import { PreferenceCommonService } from './preference-common.service';
import { PreferenceDefaultsService } from './preference-defaults.service';

@Injectable()
export class UsrPreferenceService {
  private readonly logger = new Logger('UsrPreferenceService');

  constructor(
    @InjectRepository(EUsrPreferenceBackend)
    private usrPreferenceRepository: Repository<EUsrPreferenceBackend>,
    private defaultsService: PreferenceDefaultsService,
    private prefCommon: PreferenceCommonService,
  ) {}

  public async setPreference(
    userid: string,
    key: string,
    value: PrefValueType,
  ): AsyncFailable<DecodedUsrPref> {
    // Validate
    let usrPreference = await this.validatePref(userid, key, value);
    if (HasFailed(usrPreference)) return usrPreference;

    // Set
    try {
      // Upsert here, because we want to create a new record if it does not exist
      await this.usrPreferenceRepository.upsert(usrPreference, {
        conflictPaths: ['key', 'user_id'],
      });
    } catch (e) {
      return Fail(e);
    }

    // Return
    return {
      key: usrPreference.key,
      value,
      // key has to be valid here, we validated it
      type: UsrPreferenceValueTypes[key as UsrPreference],
      user: userid,
    };
  }

  public async getPreference(
    userid: string,
    key: string,
  ): AsyncFailable<DecodedUsrPref> {
    // Validate
    let validatedKey = this.prefCommon.validatePrefKey(key, UsrPreference);
    if (HasFailed(validatedKey)) return validatedKey;

    return MutexFallBack(
      'fetchUsrPrefrence',
      async () => {
        let existing: EUsrPreferenceBackend | null;
        try {
          existing = await this.usrPreferenceRepository.findOne({
            where: { key: validatedKey as UsrPreference, user_id: userid },
            cache: 60000,
          });
          if (!existing) return null;
        } catch (e) {
          return Fail(e);
        }

        // Validate
        const result = EUsrPreferenceSchema.safeParse(existing);
        if (!result.success) {
          return Fail(result.error);
        }

        // Return
        const unpacked = this.prefCommon.validateAndUnpackPref(
          result.data,
          UsrPreference,
          UsrPreferenceValueTypes,
        );
        if (HasFailed(unpacked)) return unpacked;
        return {
          ...unpacked,
          user: result.data.user_id,
        };
      },
      () => this.saveDefault(userid, validatedKey as UsrPreference),
    );
  }

  public async getStringPreference(
    userid: string,
    key: string,
  ): AsyncFailable<string> {
    return this.getPreferencePinned(
      userid,
      key,
      'string',
    ) as AsyncFailable<string>;
  }

  public async getNumberPreference(
    userid: string,
    key: string,
  ): AsyncFailable<number> {
    return this.getPreferencePinned(
      userid,
      key,
      'number',
    ) as AsyncFailable<number>;
  }

  public async getBooleanPreference(
    userid: string,
    key: string,
  ): AsyncFailable<boolean> {
    return this.getPreferencePinned(
      userid,
      key,
      'boolean',
    ) as AsyncFailable<boolean>;
  }

  private async getPreferencePinned(
    userid: string,
    key: string,
    type: PrefValueTypeStrings,
  ): AsyncFailable<PrefValueType> {
    let pref = await this.getPreference(userid, key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== type) return Fail('Invalid preference type');

    return pref.value;
  }

  public async getAllPreferences(
    userid: string,
  ): AsyncFailable<DecodedUsrPref[]> {
    // TODO: We are fetching each value invidually, we should fetch all at once
    let internalSysPrefs = await Promise.all(
      UsrPreferenceList.map((key) => this.getPreference(userid, key)),
    );
    if (internalSysPrefs.some((pref) => HasFailed(pref))) {
      return Fail('Could not get all preferences');
    }

    return internalSysPrefs as DecodedUsrPref[];
  }

  // Private

  private async saveDefault(
    userid: string,
    key: UsrPreference, // Force enum here because we dont validate
  ): AsyncFailable<DecodedUsrPref> {
    return this.setPreference(
      userid,
      key,
      this.defaultsService.usrDefaults[key](),
    );
  }

  private async validatePref(
    userid: string,
    key: string,
    value: PrefValueType,
  ): AsyncFailable<EUsrPreferenceBackend> {
    const validated = await this.prefCommon.validatePref(
      key,
      value,
      UsrPreference,
      UsrPreferenceValueTypes,
    );
    if (HasFailed(validated)) return validated;

    let verifySysPreference = new EUsrPreferenceBackend();
    verifySysPreference.key = validated.key;
    verifySysPreference.value = validated.value;
    verifySysPreference.user_id = userid;

    // It should already be valid, but these two validators might go out of sync
    const result = EUsrPreferenceSchema.safeParse(verifySysPreference);
    if (!result.success) {
      return Fail(result.error);
    }

    return result.data;
  }
}
