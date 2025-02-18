import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { POSTGRES_URL } from '../../config';
import * as schema from './schema';

const queryClient = postgres(POSTGRES_URL);

export const db = drizzle(queryClient, { schema });
