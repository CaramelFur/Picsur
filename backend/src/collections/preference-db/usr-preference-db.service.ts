import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    DecodedUsrPref,
    PrefValueType,
    PrefValueTypeStrings,
} from 'picsur-shared/dist/dto/preferences.dto';
import {
    UsrPreference,
    UsrPreferenceList,
    UsrPreferenceValidators,
    UsrPreferenceValueTypes,
} from 'picsur-shared/dist/dto/usr-preferences.enum';
import {
    AsyncFailable,
    Fail,
    FT,
    HasFailed,
} from 'picsur-shared/dist/types/failable';
import { Repository } from 'typeorm';
import {
    EUsrPreferenceBackend,
    EUsrPreferenceSchema,
} from '../../database/entities/system/usr-preference.entity.js';
import { MutexFallBack } from '../../util/mutex-fallback.js';
import { PreferenceCommonService } from './preference-common.service.js';
import { PreferenceDefaultsService } from './preference-defaults.service.js';

@Injectable()
export class UsrPreferenceDbService {
  private readonly logger = new Logger(UsrPreferenceDbService.name);

  constructor(
    @InjectRepository(EUsrPreferenceBackend)
    private readonly usrPreferenceRepository: Repository<EUsrPreferenceBackend>,
    private readonly defaultsService: PreferenceDefaultsService,
    private readonly prefCommon: PreferenceCommonService,
  ) {}

  public async setPreference(
    userid: string,
    key: string,
    value: PrefValueType,
  ): AsyncFailable<DecodedUsrPref> {
    // Validate
    const usrPreference = await this.encodeUsrPref(userid, key, value);
    if (HasFailed(usrPreference)) return usrPreference;

    // Set
    try {
      // Upsert here, because we want to create a new record if it does not exist
      await this.usrPreferenceRepository.upsert(usrPreference, {
        conflictPaths: ['key', 'user_id'],
      });
    } catch (e) {
      return Fail(FT.Database, e);
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
    const validatedKey = this.prefCommon.validatePrefKey(key, UsrPreference);
    if (HasFailed(validatedKey)) return validatedKey;

    // See the comment in 'mutex-fallback.ts' for why we are using a mutex here
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
          return Fail(FT.Database, e);
        }

        // Validate
        const result = EUsrPreferenceSchema.safeParse(existing);
        if (!result.success) {
          return Fail(FT.SysValidation, result.error);
        }

        // Return
        const unpacked = this.prefCommon.DecodePref(
          result.data as any,
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

  // Get a preference that will be pinned to a specified type
  private async getPreferencePinned(
    userid: string,
    key: string,
    type: PrefValueTypeStrings,
  ): AsyncFailable<PrefValueType> {
    const pref = await this.getPreference(userid, key);
    if (HasFailed(pref)) return pref;
    if (pref.type !== type)
      return Fail(FT.UsrValidation, 'Invalid preference type');

    return pref.value;
  }

  public async getAllPreferences(
    userid: string,
  ): AsyncFailable<DecodedUsrPref[]> {
    // TODO: We are fetching each value invidually, we should fetch all at once
    const internalSysPrefs = await Promise.all(
      UsrPreferenceList.map((key) => this.getPreference(userid, key)),
    );
    if (internalSysPrefs.some((pref) => HasFailed(pref))) {
      return Fail(FT.Internal, 'Could not get all preferences');
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
      this.defaultsService.getUsrDefault(key),
    );
  }

  private async encodeUsrPref(
    userid: string,
    key: string,
    value: PrefValueType,
  ): AsyncFailable<EUsrPreferenceBackend> {
    const validated = await this.prefCommon.EncodePref(
      key,
      value,
      UsrPreference,
      UsrPreferenceValueTypes,
    );
    if (HasFailed(validated)) return validated;

    const valueValidated =
      UsrPreferenceValidators[key as UsrPreference].safeParse(value);
    if (!valueValidated.success) {
      return Fail(FT.UsrValidation, undefined, valueValidated.error);
    }

    const verifySysPreference = new EUsrPreferenceBackend();
    verifySysPreference.key = validated.key;
    verifySysPreference.value = validated.value;
    verifySysPreference.user_id = userid;

    // It should already be valid, but these two validators might go out of sync
    const result = EUsrPreferenceSchema.safeParse(verifySysPreference);
    if (!result.success) {
      return Fail(FT.UsrValidation, result.error);
    }

    return result.data;
  }
}
