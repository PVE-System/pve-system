import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from '../../config';
import * as schema from './schema';

const queryClient = postgres(
  `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
);

export const db = drizzle(queryClient, { schema });

//TENTATIVA DE FAZER TABELAS EM SCHEMAS SEPARADOS. NAO DEU BOA.

/* import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as clientSchema from './clientSchema'; // Importe o clientSchema aqui

const queryClient = postgres(
  'postgres://postgres:postgres@0.0.0.0:5432/postgres',
);

// Combine os schemas em um único objeto
const combinedSchema = {
  ...schema,
  ...clientSchema,
};

export const db = drizzle(queryClient, { schema: combinedSchema }); // Use o combinedSchema aqui */
