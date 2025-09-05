/* Propósito: O arquivo schema.ts é usado para definir a estrutura inicial do seu banco de dados.  Permite definir a estrutura completa do db*/
/*Neste arquivo que criamos outras tabelas, não precisa ser outro arquivo*/

import { boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Definição da tabela users com índice único no email.
// Nenhuma linha na tabela pode ter o mesmo valor para colunas que fazem parte do índice único.

/*TABELA DE USUARIOS DA EQUIPE*/

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 256 }).notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    name: varchar('name'),
    imageUrl: varchar('imageUrl', { length: 512 }), // Adicionando o campo imageUrl
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    role: varchar('role', { length: 50 }).notNull().default('vendedor'),
    is_active: boolean('is_active').notNull().default(true), // Status ativo
    operatorNumber: varchar('operator_number', { length: 20 }).notNull(),

    // Colunas para recuperação de senha
    resetToken: varchar('resetToken', { length: 256 }).default(''),
    resetTokenExpiration: timestamp('resetTokenExpiration').default(
      new Date(0),
    ),
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
  whatsapp: text('whatsapp'),
  emailCommercial: text('email_commercial').notNull(),
  emailFinancial: text('email_financial').notNull(),
  emailXml: text('email_xml').notNull(),
  socialMedia: text('social_media').notNull(),
  contactAtCompany: text('contact_at_company').notNull(),
  financialContact: text('financial_contact').notNull(),
  responsibleSeller: text('responsible_seller').notNull(),
  companySize: text('company_size').notNull(),
  hasOwnStore: text('has_own_store').notNull(),
  icmsContributor: text('icms_contributor').notNull(),
  stateRegistration: text('state_registration'), // nova coluna
  transportationType: text('transportation_type').notNull(),
  companyLocation: text('company_location').notNull(),
  marketSegmentNature: text('market_segment_nature').notNull(),
  rating: integer('rating').notNull().default(0),
  clientCondition: text('client_condition').notNull().default('normal'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  imageUrl: varchar('imageUrl', { length: 512 }),

  // Permite NULL para clientes sem grupo empresarial ou caso o grupo seja deletado
  businessGroupId: integer('business_group_id').references(
    () => businessGroups.id,
    { onDelete: 'set null' },
  ),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

/*TABELA DE INFORMAÇÕES SOBRE OS PEDIDOS*/

export const salesInformation = pgTable('sales_information', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .references(() => clients.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  commercial: text('commercial').default(''),
  commercialUpdatedAt: timestamp('commercial_updated_at').defaultNow(),
  commercialUpdatedBy: integer('commercial_updated_by').references(
    () => users.id,
  ),
  marketing: text('marketing').default(''),
  marketingUpdatedAt: timestamp('marketing_updated_at').defaultNow(),
  marketingUpdatedBy: integer('marketing_updated_by').references(
    () => users.id,
  ),
  invoicing: text('invoicing').default(''),
  invoicingUpdatedAt: timestamp('invoicing_updated_at').defaultNow(),
  invoicingUpdatedBy: integer('invoicing_updated_by').references(
    () => users.id,
  ),
  cables: text('cables').default(''),
  cablesUpdatedAt: timestamp('cables_updated_at').defaultNow(),
  cablesUpdatedBy: integer('cables_updated_by').references(() => users.id),
  financial: text('financial').notNull(),
  financialUpdatedAt: timestamp('financial_updated_at').defaultNow(),
  financialUpdatedBy: integer('financial_updated_by').references(
    () => users.id,
  ),
  invoice: text('invoice').default(''),
  invoiceUpdatedAt: timestamp('invoice_updated_at').defaultNow(),
  invoiceUpdatedBy: integer('invoice_updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SalesInformation = typeof salesInformation.$inferSelect;
export type NewSalesInformation = typeof salesInformation.$inferInsert;

/*TABELA DOS COMENTARIOS SOBRE O CLIENTE*/

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .references(() => clients.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id) // Referência à tabela de usuários
    .notNull(),
  comment: text('comment').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  favorite: boolean('favorite').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export const salesQuotes = pgTable('sales_quotes', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .references(() => clients.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  quoteName: text('quote_name').notNull(),
  quoteNumber: integer('quote_number').notNull(),
  industry: text('industry').notNull(),
  year: integer('year').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type SalesQuote = typeof salesQuotes.$inferSelect;
export type NewSalesQuote = typeof salesQuotes.$inferInsert;

// Tabela que armazena quando cada usuário visualizou uma aba pela última vez.
export const tabsViewed = pgTable('tabs_viewed', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  clientId: integer('client_id')
    .references(() => clients.id)
    .notNull(),
  salesTabViewedAt: timestamp('sales_tab_viewed_at'), // Última vez que o usuário viu a aba de vendas
  commentsTabViewedAt: timestamp('comments_tab_viewed_at'), // Última vez que o usuário viu a aba de comentários
  filesTabViewedAt: timestamp('files_tab_viewed_at'), // Última vez que o usuário viu a aba de arquivos
  excelPageTabViewedAt: timestamp('excel_page_tab_viewed_at').defaultNow(), // Última vez que o usuário viu a aba de Excel
  salesQuoteTabViewedAt: timestamp('sales_quote_tab_viewed_at').defaultNow(),
});

export type TabsViewed = typeof tabsViewed.$inferSelect;
export type NewTabsViewed = typeof tabsViewed.$inferInsert;

// Tabela que armazena quando cada usuário visualizou páginas específicas pela última vez e quando houve atualização de conteúdo
export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  pageExcel: timestamp('page_excel').defaultNow(), // Última vez que o usuário viu a página Excel
  pageDashboard: timestamp('page_dashboard').defaultNow(), // Última vez que o usuário viu o Dashboard
  pageSalesQuote: timestamp('page_sales_quote').defaultNow(), // Última vez que o usuário viu a página de cotações

  // Colunas `updated_at` para gerenciar atualizações de conteúdo
  pageExcelUpdatedAt: timestamp('page_excel_updated_at').default(
    new Date('1970-01-01T00:00:00.000Z'),
  ),
  pageDashboardUpdatedAt: timestamp('page_dashboard_updated_at').default(
    new Date('1970-01-01T00:00:00.000Z'),
  ),
  pageSalesQuoteUpdatedAt: timestamp('page_sales_quote_updated_at').default(
    new Date('1970-01-01T00:00:00.000Z'),
  ),

  lastViewedAt: timestamp('last_viewed_at').defaultNow(), // Última visualização geral da página
  lastUpdatedAt: timestamp('last_updated_at').defaultNow(), // Última vez que o conteúdo foi atualizado
});

export type PageViews = typeof pageViews.$inferSelect;
export type NewPageViews = typeof pageViews.$inferInsert;

// Nova tabela para grupos empresariais
export const businessGroups = pgTable('business_groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // Nome do grupo deve ser único
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tipos TypeScript para os novos modelos
export type BusinessGroup = typeof businessGroups.$inferSelect;
export type NewBusinessGroup = typeof businessGroups.$inferInsert;

// tabela para Ocorrencias frequentes
export const frequentOccurrences = pgTable('frequent_occurrences', {
  id: serial('id').primaryKey(),

  clientId: integer('client_id')
    .references(() => clients.id)
    .notNull(),

  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),

  problem: text('problem'),
  solution: text('solution'),
  conclusion: text('conclusion'),
  occurrencesStatus: varchar('occurrences_status', { length: 20 })
    .notNull()
    .default('EM_ABERTO'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  attachments: varchar('attachments', { length: 512 }), // usado para exibir 1 imagem principal
  attachmentsList: jsonb('attachments_list'), // reservado para suportar múltiplos uploads futuros
});

export type FrequentOccurrence = typeof frequentOccurrences.$inferSelect;
export type NewFrequentOccurrence = typeof frequentOccurrences.$inferInsert;

// tabela para as rotas de visitas

export const visitRoutes = pgTable('visit_routes', {
  id: serial('id').primaryKey(),

  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),

  routeName: varchar('route_name', { length: 100 }).notNull(),

  scheduledDate: timestamp('scheduled_date').notNull(),

  routeStatus: varchar('route_status', { length: 20 })
    .notNull()
    .default('EM_ABERTO'), // Valor inicial

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  description: text('description'), // campo opcional para comentários sobre a rota
});

export type VisitRoute = typeof visitRoutes.$inferSelect;
export type NewVisitRoute = typeof visitRoutes.$inferInsert;

// tabela para os clientes que fazem parte das rotas de visitas

export const visitRouteClients = pgTable('visit_route_clients', {
  id: serial('id').primaryKey(),

  visitRouteId: integer('visit_route_id')
    .references(() => visitRoutes.id)
    .notNull(),

  clientId: integer('client_id').references(() => clients.id),

  customerNameUnregistered: text('customer_name_unregistered'),

  customerStateUnregistered: text('customer_state_unregistered'),
  customerCityUnregistered: text('customer_city_unregistered'),
  visitStatus: varchar('visit_status', { length: 20 })
    .notNull()
    .default('AGENDADO'),

  currentVisitDescription: text('current_visit_description'),
  lastVisitDescription: text('last_visit_description'),
  lastVisitConfirmedAt: timestamp('last_visit_confirmed_at'),

  orderIndex: integer('order_index'), // Campo para ordenação manual dos clientes

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type VisitRouteClient = typeof visitRouteClients.$inferSelect;
export type NewVisitRouteClient = typeof visitRouteClients.$inferInsert;
