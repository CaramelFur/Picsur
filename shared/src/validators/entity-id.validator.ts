import { z } from 'zod';

export const IsEntityID = () => z.string().uuid();
