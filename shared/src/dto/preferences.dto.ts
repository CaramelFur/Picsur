import { z } from 'zod';
import tuple from '../types/tuple.js';
import { IsEntityID } from '../validators/entity-id.validator.js';
import { IsPrefValue } from '../validators/pref-value.validator.js';

// Variable value type
export type PrefValueType = string | number | boolean;
export type PrefValueTypeStrings = 'string' | 'number' | 'boolean';
export const PrefValueTypes = tuple('string', 'number', 'boolean');

// Decoded Representations

export const DecodedPrefSchema = z.object({
  key: z.string(),
  value: IsPrefValue(),
  type: z.enum(PrefValueTypes),
});
export type DecodedPref = z.infer<typeof DecodedSysPrefSchema>;

// Usr and Sys

export const DecodedSysPrefSchema = DecodedPrefSchema;
export type DecodedSysPref = z.infer<typeof DecodedSysPrefSchema>;

export const DecodedUsrPrefSchema = DecodedSysPrefSchema.merge(
  z.object({
    user: IsEntityID(),
  }),
);
export type DecodedUsrPref = z.infer<typeof DecodedUsrPrefSchema>;
