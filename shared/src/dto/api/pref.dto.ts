import { Type } from 'class-transformer';
import {
  IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested
} from 'class-validator';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsSysPrefValue } from '../../validators/syspref.validator';
import { SysPrefValueType, SysPrefValueTypes, SysPrefValueTypeStrings } from '../syspreferences.dto';

export class SysPreferenceBaseResponse {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsSysPrefValue()
  value: SysPrefValueType;

  @IsNotEmpty()
  @IsEnum(SysPrefValueTypes)
  type: SysPrefValueTypeStrings;
}

// Get Syspreference
// Request is done via url parameters
export class GetSyspreferenceResponse extends SysPreferenceBaseResponse {}

// Get syspreferences
export class MultipleSysPreferencesResponse {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SysPreferenceBaseResponse)
  preferences: SysPreferenceBaseResponse[];

  @IsPosInt()
  total: number;
}

// Update Syspreference
export class UpdateSysPreferenceRequest {
  @IsNotEmpty()
  @IsSysPrefValue()
  value: SysPrefValueType;
}
export class UpdateSysPreferenceResponse extends SysPreferenceBaseResponse {}


