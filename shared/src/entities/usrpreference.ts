import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsPosInt } from '../validators/positive-int.validator';

export const EUsrPreferenceSchema = z.object({
  id: IsEntityID().optional(),
  key: z.string(),
  value: z.string(),
  userId: IsPosInt(),
})
export type EUsrPreference = z.infer<typeof EUsrPreferenceSchema>;
