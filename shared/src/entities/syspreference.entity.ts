import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator';

export const ESysPreferenceSchema = z.object({
  id: IsEntityID().optional(),
  key: z.string(),
  value: z.string(),
});
export type ESysPreference = z.infer<typeof ESysPreferenceSchema>;
