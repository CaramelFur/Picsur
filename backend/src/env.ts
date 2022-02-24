import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../');

const Config = {
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME ?? 'imagur',
    password: process.env.DB_PASSWORD ?? 'imagur',
    database: process.env.DB_DATABASE ?? 'imagur',
  },
  defaultAdmin: {
    username: process.env.DEFAULT_ADMIN_USERNAME ?? 'admin',
    password: process.env.DEFAULT_ADMIN_PASSWORD ?? 'admin',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'CHANGE_ME',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  uploadLimits: {
    fieldNameSize: 128,
    fieldSize: 1024,
    fields: 16,
    files: 16,
    fileSize: process.env.MAX_FILE_SIZE
      ? parseInt(process.env.MAX_FILE_SIZE)
      : 128000000,
  },
  static: {
    packageRoot: packageRoot,
    frontendRoot:
      process.env.STATIC_FRONTEND_ROOT ?? join(packageRoot, '../frontend/dist'),
    backendRoutes: ['i', 'api'],
  },
};

export default Config;
