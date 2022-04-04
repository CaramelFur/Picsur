import { z } from 'zod';

export const IsPrefValue = () => z.string().or(z.number().or(z.boolean()));
