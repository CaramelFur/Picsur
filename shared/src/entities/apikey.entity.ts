import { z } from 'zod';
import { IsApiKey } from '../validators/api-key.validator.js';
import { IsEntityID } from '../validators/entity-id.validator.js';

export const EApiKeySchema = z.object({
  id: IsEntityID(),
  key: IsApiKey(),
  user: IsEntityID(),
  name: z.string().min(3).max(255),
  created: z.preprocess((data: any) => new Date(data), z.date()),
  last_used: z.preprocess((data: any) => new Date(data), z.date()).nullable(),
});
export type EApiKey = z.infer<typeof EApiKeySchema>;
