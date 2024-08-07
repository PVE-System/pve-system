/* RARAS import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/db/schema.ts',
  out: './db/migrations',
}); */

import './envConfig';
import { defineConfig } from 'drizzle-kit';
import {
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_URL,
  DB_PORT,
  POSTGRES_DATABASE,
} from './config';

export default defineConfig({
  dialect: 'postgresql', // Certifique-se de que 'postgresql' é o tipo correto
  schema: './app/db/schema.ts',
  out: './db/migrations',
  dbCredentials: {
    url: POSTGRES_URL,
  },
});
