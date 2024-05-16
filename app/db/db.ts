import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const queryClient = postgres(
  'postgres://postgres:postgres@0.0.0.0:5432/postgres',
);

export const db = drizzle(queryClient, { schema });
