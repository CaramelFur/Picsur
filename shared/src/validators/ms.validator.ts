import ms from 'ms';
import { z } from 'zod';

export const IsValidMS = () =>
  z.preprocess((v) => ms(v as any), z.number().int().min(0));
