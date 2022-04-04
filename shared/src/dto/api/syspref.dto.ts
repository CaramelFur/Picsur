import { z } from 'zod';
import { createZodDto } from '../../util/create-zod-dto';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsPrefValue } from '../../validators/pref-value.validator';
import { DecodedSysPrefSchema } from '../preferences.dto';


// Get Syspreference
// Request is done via url parameters
export const GetSysPreferenceResponseSchema = DecodedSysPrefSchema;
export class GetSysPreferenceResponse extends createZodDto(GetSysPreferenceResponseSchema) {}

// Get syspreferences
export const MultipleSysPreferencesResponseSchema = z.object({
  preferences: z.array(DecodedSysPrefSchema),
  total: IsPosInt(),
});
export class MultipleSysPreferencesResponse extends createZodDto(MultipleSysPreferencesResponseSchema) {}

// Update Syspreference
export const UpdateSysPreferenceRequestSchema = z.object({
  value: IsPrefValue(),
});
export class UpdateSysPreferenceRequest extends createZodDto(UpdateSysPreferenceRequestSchema) {}

export const UpdateSysPreferenceResponseSchema = DecodedSysPrefSchema;
export class UpdateSysPreferenceResponse extends createZodDto(UpdateSysPreferenceResponseSchema) {}


