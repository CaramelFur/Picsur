import { z } from 'zod';

export const IsPosInt = () => z.number().int().nonnegative();
