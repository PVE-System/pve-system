CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"cnpj" text NOT NULL,
	"cpf" text NOT NULL,
	"cep" text NOT NULL,
	"address" text NOT NULL,
	"location_number" text NOT NULL,
	"district" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"corfio_code" text NOT NULL,
	"phone" text NOT NULL,
	"whatsapp" text,
	"email_commercial" text NOT NULL,
	"email_financial" text NOT NULL,
	"email_xml" text NOT NULL,
	"social_media" text NOT NULL,
	"contact_at_company" text NOT NULL,
	"financial_contact" text NOT NULL,
	"responsible_seller" text NOT NULL,
	"company_size" text NOT NULL,
	"has_own_store" text NOT NULL,
	"icms_contributor" text NOT NULL,
	"state_registration" text,
	"transportation_type" text NOT NULL,
	"company_location" text NOT NULL,
	"market_segment_nature" text NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"client_condition" text DEFAULT 'normal' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"imageUrl" varchar(512)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"comment" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"page_excel" timestamp DEFAULT now(),
	"page_dashboard" timestamp DEFAULT now(),
	"page_sales_quote" timestamp DEFAULT now(),
	"page_excel_updated_at" timestamp DEFAULT '1970-01-01 00:00:00.000',
	"page_dashboard_updated_at" timestamp DEFAULT '1970-01-01 00:00:00.000',
	"page_sales_quote_updated_at" timestamp DEFAULT '1970-01-01 00:00:00.000',
	"last_viewed_at" timestamp DEFAULT now(),
	"last_updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_information" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"commercial" text DEFAULT '',
	"commercial_updated_at" timestamp DEFAULT now(),
	"commercial_updated_by" integer,
	"marketing" text DEFAULT '',
	"marketing_updated_at" timestamp DEFAULT now(),
	"marketing_updated_by" integer,
	"invoicing" text DEFAULT '',
	"invoicing_updated_at" timestamp DEFAULT now(),
	"invoicing_updated_by" integer,
	"cables" text DEFAULT '',
	"cables_updated_at" timestamp DEFAULT now(),
	"cables_updated_by" integer,
	"financial" text NOT NULL,
	"financial_updated_at" timestamp DEFAULT now(),
	"financial_updated_by" integer,
	"invoice" text DEFAULT '',
	"invoice_updated_at" timestamp DEFAULT now(),
	"invoice_updated_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales_quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"quote_name" text NOT NULL,
	"quote_number" integer NOT NULL,
	"industry" text NOT NULL,
	"year" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tabs_viewed" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"client_id" integer NOT NULL,
	"sales_tab_viewed_at" timestamp,
	"comments_tab_viewed_at" timestamp,
	"files_tab_viewed_at" timestamp,
	"excel_page_tab_viewed_at" timestamp DEFAULT now(),
	"sales_quote_tab_viewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"name" varchar,
	"imageUrl" varchar(512),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"role" varchar(50) DEFAULT 'vendedor' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"operator_number" varchar(20) NOT NULL,
	"resetToken" varchar(256) DEFAULT '',
	"resetTokenExpiration" timestamp DEFAULT '1970-01-01 00:00:00.000'
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "page_views" ADD CONSTRAINT "page_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_information" ADD CONSTRAINT "sales_information_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_information" ADD CONSTRAINT "sales_information_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_information" ADD CONSTRAINT "sales_information_commercial_updated_by_users_id_fk" FOREIGN KEY ("commercial_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_information" ADD CONSTRAINT "sales_information_marketing_updated_by_users_id_fk" FOREIGN KEY ("marketing_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_information" ADD CONSTRAINT "sales_information_invoicing_updated_by_users_id_fk" FOREIGN KEY ("invoicing_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_information" ADD CONSTRAINT "sales_information_cables_updated_by_users_id_fk" FOREIGN KEY ("cables_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_information" ADD CONSTRAINT "sales_information_financial_updated_by_users_id_fk" FOREIGN KEY ("financial_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_information" ADD CONSTRAINT "sales_information_invoice_updated_by_users_id_fk" FOREIGN KEY ("invoice_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_quotes" ADD CONSTRAINT "sales_quotes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_quotes" ADD CONSTRAINT "sales_quotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tabs_viewed" ADD CONSTRAINT "tabs_viewed_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tabs_viewed" ADD CONSTRAINT "tabs_viewed_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "users" ("email");