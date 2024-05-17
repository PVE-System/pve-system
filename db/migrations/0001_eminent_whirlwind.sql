CREATE TABLE IF NOT EXISTS "usersTeam" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"password" varchar(256)
);
