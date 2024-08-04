import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator.js';

export const EImageSchema = z.object({
  id: IsEntityID(),
  user_id: IsEntityID(),
  created: z.preprocess((data: any) => new Date(data), z.date()),
  file_name: z.string(),
  expires_at: z.preprocess((data: any) => new Date(data), z.date()).nullable(),
});
export type EImage = z.infer<typeof EImageSchema>;
