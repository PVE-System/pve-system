ALTER TABLE "clients" ADD COLUMN "business_group_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clients" ADD CONSTRAINT "clients_business_group_id_business_groups_id_fk" FOREIGN KEY ("business_group_id") REFERENCES "public"."business_groups"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
