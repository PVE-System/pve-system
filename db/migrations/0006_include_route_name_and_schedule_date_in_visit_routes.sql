ALTER TABLE "visit_routes" ADD COLUMN "route_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "visit_routes" ADD COLUMN "scheduled_date" timestamp NOT NULL;