import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty, ValidateNested
} from 'class-validator';
import {
  IsSysPrefValue,
  SysPreferences,
  SysPrefValueType,
  SysPrefValueTypes,
  SysPrefValueTypeStrings
} from '../syspreferences.dto';

export class UpdateSysPreferenceRequest {
  @IsNotEmpty()
  value: string;
}

export class SysPreferenceResponse {
  @IsNotEmpty()
  @IsEnum(SysPreferences)
  key: SysPreferences;

  @IsNotEmpty()
  @IsSysPrefValue()
  value: SysPrefValueType;

  @IsNotEmpty()
  @IsEnum(SysPrefValueTypes)
  type: SysPrefValueTypeStrings;
}

export class MultipleSysPreferencesResponse {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SysPreferenceResponse)
  preferences: SysPreferenceResponse[];
}
