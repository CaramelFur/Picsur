import { z } from 'zod';
import { createZodDto } from '../../util/create-zod-dto.js';
import { IsPosInt } from '../../validators/positive-int.validator.js';
import { IsPrefValue } from '../../validators/pref-value.validator.js';
import { DecodedPrefSchema } from '../preferences.dto.js';

// Get preference
// Request is done via url parameters
export const GetPreferenceResponseSchema = DecodedPrefSchema;
export class GetPreferenceResponse extends createZodDto(
  GetPreferenceResponseSchema,
) {}

// Get preferences
export const MultiplePreferencesResponseSchema = z.object({
  results: z.array(DecodedPrefSchema),
  total: IsPosInt(),
});
export class MultiplePreferencesResponse extends createZodDto(
  MultiplePreferencesResponseSchema,
) {}

// Update preference
export const UpdatePreferenceRequestSchema = z.object({
  value: IsPrefValue(),
});
export class UpdatePreferenceRequest extends createZodDto(
  UpdatePreferenceRequestSchema,
) {}

export const UpdatePreferenceResponseSchema = DecodedPrefSchema;
export class UpdatePreferenceResponse extends createZodDto(
  UpdatePreferenceResponseSchema,
) {}
