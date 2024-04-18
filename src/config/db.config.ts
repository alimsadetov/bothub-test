export const DB_NAME = 'DB_NAME';
export const POSTGRES_USER = 'POSTGRES_USER';
export const POSTGRES_PASSWORD = 'POSTGRES_PASSWORD';
export const DB_HOST = 'DB_HOST';
export const DB_PORT = 'DB_PORT';

export default () => ({
  [DB_NAME]: process.env[DB_NAME] || 'dbname',
  [POSTGRES_USER]: process.env[POSTGRES_USER] || 'user',
  [POSTGRES_PASSWORD]: process.env[POSTGRES_PASSWORD] || 'password',
  [DB_HOST]: process.env[DB_HOST] || 'localhost',
  [DB_PORT]: process.env[DB_PORT] || 5432,
});
