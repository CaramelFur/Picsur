const Config = {
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT) ?? 5432,
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
};

export default Config;
