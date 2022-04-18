import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DecodedUsrPref,
  PrefValueType,
  PrefValueTypeStrings
} from 'picsur-shared/dist/dto/preferences.dto';
import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.dto';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import {
  UsrPreferenceList,
  UsrPreferenceValueTypes
} from '../../models/constants/usrpreferences.const';
import {
  EUsrPreferenceBackend,
  EUsrPreferenceSchema
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
        conflictPaths: ['key', 'userId'],
      });
    } catch (e: any) {
      this.logger.warn(e);
      return Fail('Could not save preference');
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

    let foundUsrPreference: EUsrPreferenceBackend;
    try {
      foundUsrPreference = await MutexFallBack(
        'fetchUsrPrefrence',
        () =>
          this.usrPreferenceRepository.findOne({
            where: { key: validatedKey as UsrPreference, userId: userid },
            cache: 60000,
          }),
        () => this.saveDefault(userid, validatedKey as UsrPreference),
      );
    } catch (e: any) {
      this.logger.warn(e);
      return Fail('Could not get preference');
    }

    // Validate
    const result = EUsrPreferenceSchema.safeParse(foundUsrPreference);
    if (!result.success) {
      this.logger.warn(result.error);
      return Fail('Invalid preference');
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
      user: result.data.userId,
    };
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
    verifySysPreference.userId = userid;

    // It should already be valid, but these two validators might go out of sync
    const result = EUsrPreferenceSchema.safeParse(verifySysPreference);
    if (!result.success) {
      this.logger.warn(result.error);
      return Fail('Invalid preference');
    }

    return result.data;
  }
}
