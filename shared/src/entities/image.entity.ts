import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator';

export const EImageSchema = z.object({
  id: IsEntityID(),
  user_id: z.string(),
  created: z.preprocess((data: any) => new Date(data), z.date()),
  file_name: z.string(),
});
export type EImage = z.infer<typeof EImageSchema>;
