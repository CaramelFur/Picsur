import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsPosInt } from '../validators/positive-int.validator';

const MONTH_IN_SECONDS = 60 * 60 * 24 * 30;
const FIVE_MIN_IN_SECONDS = 60 * 5;

export const EImageSchema = z.object({
  id: IsEntityID(),
  user_id: IsEntityID(),
  created: z.preprocess((data: any) => new Date(data), z.date()),
  file_name: z.string(),
  expires_at: z
    .preprocess((data: any) => new Date(data), z.date())
    .nullable(),
});
export type EImage = z.infer<typeof EImageSchema>;
