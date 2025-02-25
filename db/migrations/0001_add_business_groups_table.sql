CREATE TABLE IF NOT EXISTS "business_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_groups_name_unique" UNIQUE("name")
);
