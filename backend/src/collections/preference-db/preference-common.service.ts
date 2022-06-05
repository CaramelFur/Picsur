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
  HasFailed,
} from 'picsur-shared/dist/types';

type Enum = Record<string, string>;
type EnumValue<E> = E[keyof E];
type PrefValueTypeType<E extends Enum> = {
  [key in EnumValue<E>]: PrefValueTypeStrings;
};
type KeyValuePref = {
  key: string;
  value: string;
};

@Injectable()
export class PreferenceCommonService {
  private readonly logger = new Logger('PreferenceCommonService');

  public validateAndUnpackPref<E extends Enum>(
    preference: KeyValuePref,
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
          value: preference.value == 'true',
          type: 'boolean',
        };
    }

    return Fail('Invalid preference value');
  }

  public async validatePref<E extends Enum>(
    key: string,
    value: PrefValueType,
    prefType: E,
    prefValueTypes: PrefValueTypeType<E>,
  ): AsyncFailable<KeyValuePref> {
    const validatedKey = this.validatePrefKey(key, prefType);
    if (HasFailed(validatedKey)) return validatedKey;

    const valueType = prefValueTypes[validatedKey];
    const validatedValue = this.validateAndPackPrefValue(value, valueType);
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
      return Fail('Invalid preference key');
    }

    return key as V;
  }

  public validateAndPackPrefValue(
    value: PrefValueType,
    expectedType: PrefValueTypeStrings,
  ): Failable<string> {
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
