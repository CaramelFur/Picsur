import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../');

const Config = {
  host: process.env.IMAGUR_HOST || '0.0.0.0',
  port: process.env.IMAGUR_PORT || 8080,
  database: {
    host: process.env.IMAGUR_DB_HOST ?? 'localhost',
    port: process.env.IMAGUR_DB_PORT
      ? parseInt(process.env.IMAGUR_DB_PORT)
      : 5432,
    username: process.env.IMAGUR_DB_USERNAME ?? 'imagur',
    password: process.env.IMAGUR_DB_PASSWORD ?? 'imagur',
    database: process.env.IMAGUR_DB_DATABASE ?? 'imagur',
  },
  defaultAdmin: {
    username: process.env.IMAGUR_ADMIN_USERNAME ?? 'admin',
    password: process.env.IMAGUR_ADMIN_PASSWORD ?? 'admin',
  },
  jwt: {
    secret: process.env.IMAGUR_JWT_SECRET ?? 'CHANGE_ME',
    expiresIn: process.env.IMAGUR_JWT_EXPIRES_IN ?? '1d',
  },
  uploadLimits: {
    fieldNameSize: 128,
    fieldSize: 1024,
    fields: 16,
    files: 16,
    fileSize: process.env.IMAGUR_MAX_FILE_SIZE
      ? parseInt(process.env.IMAGUR_MAX_FILE_SIZE)
      : 128000000,
  },
  static: {
    packageRoot: packageRoot,
    frontendRoot:
      process.env.IMAGUR_STATIC_FRONTEND_ROOT ??
      join(packageRoot, '../frontend/dist'),
    backendRoutes: ['i', 'api'],
  },
};

export default Config;
