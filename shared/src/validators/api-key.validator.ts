import { z } from 'zod';

export const IsApiKey = () =>
  z.string().regex(/^[a-zA-Z0-9]{32}$/, 'Invalid API key');
