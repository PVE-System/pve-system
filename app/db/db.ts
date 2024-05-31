import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const queryClient = postgres(
  'postgres://postgres:postgres@0.0.0.0:5432/postgres',
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
