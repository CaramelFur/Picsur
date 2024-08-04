import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator.js';

export const JwtDataSchema = z.object({
  uid: IsEntityID(),
  iat: z.number().int().optional(),
  exp: z.number().int().optional(),
});
export type JwtData = z.infer<typeof JwtDataSchema>;
