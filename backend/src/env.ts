import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../');

const Config = {
  main: {
    host: process.env.PICSUR_HOST || '0.0.0.0',
    port: process.env.PICSUR_PORT || 8080,
  },
  database: {
    host: process.env.PICSUR_DB_HOST ?? 'localhost',
    port: process.env.PICSUR_DB_PORT
      ? parseInt(process.env.PICSUR_DB_PORT)
      : 5432,
    username: process.env.PICSUR_DB_USERNAME ?? 'picsur',
    password: process.env.PICSUR_DB_PASSWORD ?? 'picsur',
    database: process.env.PICSUR_DB_DATABASE ?? 'picsur',
  },
  defaultAdmin: {
    username: process.env.PICSUR_ADMIN_USERNAME ?? 'admin',
    password: process.env.PICSUR_ADMIN_PASSWORD ?? 'admin',
  },
  jwt: {
    secret: process.env.PICSUR_JWT_SECRET ?? 'CHANGE_ME',
    expiresIn: process.env.PICSUR_JWT_EXPIRES_IN ?? '1d',
  },
  uploadLimits: {
    fieldNameSize: 128,
    fieldSize: 1024,
    fields: 16,
    files: 16,
    fileSize: process.env.PICSUR_MAX_FILE_SIZE
      ? parseInt(process.env.PICSUR_MAX_FILE_SIZE)
      : 128000000,
  },
  static: {
    packageRoot: packageRoot,
    frontendRoot:
      process.env.PICSUR_STATIC_FRONTEND_ROOT ??
      join(packageRoot, '../frontend/dist'),
    backendRoutes: ['i', 'api'],
  },
  demo: {
    enabled: process.env.PICSUR_DEMO?.toLowerCase() === 'true',
    interval: process.env.PICSUR_DEMO_INTERVAL
      ? parseInt(process.env.PICSUR_DEMO_INTERVAL)
      : 1000 * 60 * 5,
  },
};

export default Config;
