/* Propósito: O arquivo schema.ts é usado para definir a estrutura inicial do seu banco de dados.  Permite definir a estrutura completa do db*/
/*Neste arquivo que criamos outras tabelas, nao precisa ser outro arquivo*/

import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email'),
  password: varchar('password', { length: 256 }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
