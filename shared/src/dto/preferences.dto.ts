import { IsEnum, IsString } from 'class-validator';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsPrefValue } from '../validators/pref-value.validator';

// Variable value type
export type PrefValueType = string | number | boolean;
export type PrefValueTypeStrings = 'string' | 'number' | 'boolean';
export const PrefValueTypes = ['string', 'number', 'boolean'];

// Decoded Representations

export class DecodedSysPref {
  @IsString()
  key: string;

  @IsPrefValue()
  value: PrefValueType;

  @IsEnum(PrefValueTypes)
  type: PrefValueTypeStrings;
}

export class DecodedUsrPref extends DecodedSysPref {
  @IsEntityID()
  user: string;
}
