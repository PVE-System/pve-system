export const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  'postgres://default:tOY84eilgZnz@ep-morning-feather-a4gma43p-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require';
export const POSTGRES_USER = process.env.POSTGRES_USER || 'default';
export const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
export const DB_PORT = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT, 10)
  : 5432;
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'verceldb';
