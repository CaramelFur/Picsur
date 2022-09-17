import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const ReportUrl = 'https://metrics.picsur.org';
export const ReportInterval = 1000 * 60 * 60;
export const EnvPrefix = 'PICSUR_';
export const DefaultName = 'picsur';

export const PackageRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../',
);
