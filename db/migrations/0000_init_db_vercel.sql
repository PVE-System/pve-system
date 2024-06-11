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
	"email" text NOT NULL,
	"social_media" text NOT NULL,
	"contact_at_company" text NOT NULL,
	"financial_contact" text NOT NULL,
	"responsible_seller" text NOT NULL,
	"company_size" text NOT NULL,
	"has_own_store" text NOT NULL,
	"is_jsm_client" text NOT NULL,
	"included_by_jsm" text NOT NULL,
	"icms_contributor" text NOT NULL,
	"transportation_type" text NOT NULL,
	"company_location" text NOT NULL,
	"market_segment_nature" text NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"client_condition" text DEFAULT 'normal' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "users" ("email");