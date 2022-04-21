import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator';

export const EImageSchema = z.object({
  id: IsEntityID(),
});
export type EImage = z.infer<typeof EImageSchema>;
