CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text,
	"phone" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "rating";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "clientCondition";