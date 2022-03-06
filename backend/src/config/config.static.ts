import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const EnvPrefix = 'PICSUR_';
export const DefaultName = 'picsur';

export const PackageRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../',
);
