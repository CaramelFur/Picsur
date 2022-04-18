import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator';

export const EntityIDObjectSchema = z.object({
  id: IsEntityID(),
});
