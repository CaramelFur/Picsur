import { z } from 'zod';
import { IsApiKey } from '../validators/api-key.validator';
import { IsEntityID } from '../validators/entity-id.validator';

export const EApiKeySchema = z.object({
  key: IsApiKey(),
  user: IsEntityID(),
  created: z.preprocess((data: any) => new Date(data), z.date()),
  last_used: z.preprocess((data: any) => new Date(data), z.date()).nullable()
});
export type EApiKey = z.infer<typeof EApiKeySchema>;
