import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  DB_PORT,
  POSTGRES_USER,
  POSTGRES_URL,
} from '../../config';
import * as schema from './schema';

const queryClient = postgres(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${DB_PORT}/${POSTGRES_DATABASE}?sslmode=require`,
);

export const db = drizzle(queryClient, { schema });
