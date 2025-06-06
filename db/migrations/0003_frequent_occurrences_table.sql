CREATE TABLE IF NOT EXISTS "frequent_occurrences" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"problem" text,
	"solution" text,
	"conclusion" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"attachments" varchar(512),
	"attachments_list" jsonb
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frequent_occurrences" ADD CONSTRAINT "frequent_occurrences_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frequent_occurrences" ADD CONSTRAINT "frequent_occurrences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
