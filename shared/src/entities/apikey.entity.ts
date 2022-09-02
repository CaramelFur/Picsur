import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator';

export const EApiKeySchema = z.object({
  key: z.string(),
  user_id: IsEntityID(),
  created: z.preprocess((data: any) => new Date(data), z.date()),
});
export type EApiKey = z.infer<typeof EApiKeySchema>;
