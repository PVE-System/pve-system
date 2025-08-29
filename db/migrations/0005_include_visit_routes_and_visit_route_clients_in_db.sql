CREATE TABLE IF NOT EXISTS "visit_route_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"visit_route_id" integer NOT NULL,
	"client_id" integer,
	"customer_name_unregistered" text,
	"customer_state_unregistered" text,
	"customer_city_unregistered" text,
	"visit_status" varchar(20) DEFAULT 'AGENDADO' NOT NULL,
	"current_visit_description" text,
	"last_visit_description" text,
	"last_visit_confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visit_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"route_status" varchar(20) DEFAULT 'EM_ABERTO' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"description" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visit_route_clients" ADD CONSTRAINT "visit_route_clients_visit_route_id_visit_routes_id_fk" FOREIGN KEY ("visit_route_id") REFERENCES "public"."visit_routes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visit_route_clients" ADD CONSTRAINT "visit_route_clients_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visit_routes" ADD CONSTRAINT "visit_routes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
