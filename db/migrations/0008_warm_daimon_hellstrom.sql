DROP TABLE "users";--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "rating" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "clientCondition" text DEFAULT 'normal' NOT NULL;