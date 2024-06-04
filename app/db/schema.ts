/* Propósito: O arquivo schema.ts é usado para definir a estrutura inicial do seu banco de dados.  Permite definir a estrutura completa do db*/
/*Neste arquivo que criamos outras tabelas, não precisa ser outro arquivo*/

import { integer, uniqueIndex } from 'drizzle-orm/pg-core';
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
export type User = typeof usersTeam.$inferSelect;
export type NewUser = typeof usersTeam.$inferInsert;

/*TABELA DE CLIENTES REGISTRADOS*/

export const clients = pgTable('clients2', {
  id: serial('id').primaryKey(),
  companyName: text('companyName').notNull(),
  cnpj: text('cnpj').notNull(),
  cpf: text('cpf').notNull(),
  cep: text('cep').notNull(),
  address: text('address').notNull(),
  locationNumber: text('locationNumber').notNull(),
  district: text('district').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  corfioCode: text('corfioCode').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  socialMedia: text('socialMedia').notNull(),
  contactAtCompany: text('contactAtCompany').notNull(),
  financialContact: text('financialContact').notNull(),
  responsibleSeller: text('responsibleSeller').notNull(),
  companySize: text('companySize').notNull(),
  hasOwnStore: text('hasOwnStore').notNull(),
  isJSMClient: text('isJSMClient').notNull(),
  includedByJSM: text('includedByJSM').notNull(),
  icmsContributor: text('icmsContributor').notNull(),
  transportationType: text('transportationType').notNull(),
  companyLocation: text('companyLocation').notNull(),
  marketSegmentNature: text('marketSegmentNature').notNull(),
  rating: integer('rating').notNull().default(0),
  clientCondition: text('clientCondition').notNull().default('normal'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

// Tipos inferidos para ser importados nas operações(route handlers(manipuladores))
