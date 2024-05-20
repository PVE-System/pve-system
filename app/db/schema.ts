/* Propósito: O arquivo schema.ts é usado para definir a estrutura inicial do seu banco de dados.  Permite definir a estrutura completa do db*/
/*Neste arquivo que criamos outras tabelas, não precisa ser outro arquivo*/

import { uniqueIndex } from 'drizzle-orm/pg-core';
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

// Definição da tabela users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

// Definição da tabela usersTeam com índice único no email.
// Nenhuma linha na tabela pode ter o mesmo valor para colunas que fazem parte do índice único.
export const usersTeam = pgTable(
  'usersTeam',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 256 }).notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(table.email),
    };
  },
);

// Tipos inferidos para ser importados nas operações(route handlers(manipuladores)) na tabela uabaixo:
/* export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert; */

export type User = typeof usersTeam.$inferSelect;
export type NewUser = typeof usersTeam.$inferInsert;
