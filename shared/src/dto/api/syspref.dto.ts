import {
  IsArray
} from 'class-validator';
import { IsNested } from '../../validators/nested.validator';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsPrefValue } from '../../validators/pref-value.validator';
import { DecodedSysPref, PrefValueType } from '../preferences.dto';


// Get Syspreference
// Request is done via url parameters
export class GetSyspreferenceResponse extends DecodedSysPref {}

// Get syspreferences
export class MultipleSysPreferencesResponse {
  @IsArray()
  @IsNested(DecodedSysPref)
  preferences: DecodedSysPref[];

  @IsPosInt()
  total: number;
}

// Update Syspreference
export class UpdateSysPreferenceRequest {
  @IsPrefValue()
  value: PrefValueType;
}
export class UpdateSysPreferenceResponse extends DecodedSysPref {}


