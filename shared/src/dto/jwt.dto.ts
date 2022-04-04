import { z } from 'zod';
import { EUserSchema } from '../entities/user.entity';

export const JwtDataSchema = z.object({
  user: EUserSchema.required(),
  iat: z.number().int().optional(),
  exp: z.number().int().optional(),
});
export type JwtData = z.infer<typeof JwtDataSchema>;
