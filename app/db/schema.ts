/* Propósito: O arquivo schema.ts é usado para definir a estrutura inicial do seu banco de dados.  Permite definir a estrutura completa do db*/
/*Neste arquivo que criamos outras tabelas, não precisa ser outro arquivo*/

import { integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

// Definição da tabela users com índice único no email.
// Nenhuma linha na tabela pode ter o mesmo valor para colunas que fazem parte do índice único.

/*TABELA DE USUARIOS DA EQUIPE*/

export const users = pgTable(
  'users',
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
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/*TABELA DE CLIENTES REGISTRADOS*/

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').notNull(),
  cnpj: text('cnpj').notNull(),
  cpf: text('cpf').notNull(),
  cep: text('cep').notNull(),
  address: text('address').notNull(),
  locationNumber: text('location_number').notNull(),
  district: text('district').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  corfioCode: text('corfio_code').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  socialMedia: text('social_media').notNull(),
  contactAtCompany: text('contact_at_company').notNull(),
  financialContact: text('financial_contact').notNull(),
  responsibleSeller: text('responsible_seller').notNull(),
  companySize: text('company_size').notNull(),
  hasOwnStore: text('has_own_store').notNull(),
  isJSMClient: text('is_jsm_client').notNull(),
  includedByJSM: text('included_by_jsm').notNull(),
  icmsContributor: text('icms_contributor').notNull(),
  transportationType: text('transportation_type').notNull(),
  companyLocation: text('company_location').notNull(),
  marketSegmentNature: text('market_segment_nature').notNull(),
  rating: integer('rating').notNull().default(0),
  clientCondition: text('client_condition').notNull().default('normal'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

/*TABELA DE INFORMAÇÕES SOBRE OS PEDIDOS*/

export const salesInformation = pgTable('sales_information', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .references(() => clients.id)
    .notNull(),
  commercial: text('commercial').notNull(),
  marketing: text('marketing').notNull(),
  invoicing: text('invoicing').notNull(),
  cables: text('cables').notNull(),
  financial: text('financial').notNull(),
  invoice: text('invoice').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type SalesInformation = typeof salesInformation.$inferSelect;
export type NewSalesInformation = typeof salesInformation.$inferInsert;

// Tipos inferidos para ser importados nas operações(route handlers(manipuladores))
