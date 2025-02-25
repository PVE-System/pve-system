export const POSTGRES_URL =
  process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432';
export const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
export const DB_PORT = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT, 10)
  : 5432;
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'postgres';

console.log('debug raras');
