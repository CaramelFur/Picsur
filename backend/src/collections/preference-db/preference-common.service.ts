import { Injectable, Logger } from '@nestjs/common';
import {
  DecodedPref,
  PrefValueType,
  PrefValueTypeStrings,
} from 'picsur-shared/dist/dto/preferences.dto';
import {
  AsyncFailable,
  Fail,
  Failable,
  FT,
  HasFailed,
} from 'picsur-shared/dist/types/failable';

type Enum = Record<string, string>;
type EnumValue<E> = E[keyof E];
type PrefValueTypeType<E extends Enum> = {
  [key in EnumValue<E>]: PrefValueTypeStrings;
};
type EncodedPref<E extends Enum> = {
  key: EnumValue<E>;
  value: string;
};

@Injectable()
export class PreferenceCommonService {
  private readonly logger = new Logger(PreferenceCommonService.name);

  // Preferences values are only validated upon encoding, not decoding
  // The preference keys are always validated

  // E is either the SysPreference or the UsrPreference enum
  // the pref value types is the object containing the type of each key in E
  public DecodePref<E extends Enum>(
    preference: EncodedPref<E>,
    prefType: E,
    prefValueTypes: PrefValueTypeType<E>,
  ): Failable<DecodedPref> {
    const key = this.validatePrefKey(preference.key, prefType);
    if (HasFailed(key)) return key;

    const type = prefValueTypes[key];
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
          value: preference.value === 'true',
          type: 'boolean',
        };
    }

    return Fail(FT.UsrValidation, 'Invalid preference value');
  }

  public async EncodePref<E extends Enum>(
    key: string,
    value: PrefValueType,
    prefType: E,
    prefValueTypes: PrefValueTypeType<E>,
  ): AsyncFailable<EncodedPref<E>> {
    const validatedKey = this.validatePrefKey(key, prefType);
    if (HasFailed(validatedKey)) return validatedKey;

    const valueType = prefValueTypes[validatedKey];
    const validatedValue = this.encodePrefValue(value, valueType);
    if (HasFailed(validatedValue)) return validatedValue;

    return {
      key: validatedKey,
      value: validatedValue,
    };
  }

  public validatePrefKey<E extends Enum, V extends EnumValue<E>>(
    key: string,
    prefType: E,
  ): Failable<V> {
    const keysList = Object.values(prefType);
    if (!keysList.includes(key)) {
      return Fail(FT.UsrValidation, 'Invalid preference key');
    }

    return key as V;
  }

  public encodePrefValue(
    value: PrefValueType,
    expectedType: PrefValueTypeStrings,
  ): Failable<string> {
    const type = typeof value;
    if (type !== expectedType) {
      return Fail(FT.UsrValidation, 'Invalid preference value');
    }

    switch (type) {
      case 'string':
        return value as string;
      case 'number':
        return value.toString();
      case 'boolean':
        return value ? 'true' : 'false';
    }

    return Fail(FT.UsrValidation, 'Invalid preference value');
  }
}
