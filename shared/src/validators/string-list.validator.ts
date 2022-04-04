import { z } from 'zod';

export const IsStringList = () => z.array(z.string());
