ALTER TABLE "usersTeam" ALTER COLUMN "email" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "usersTeam" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "usersTeam" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "usersTeam" ("email");