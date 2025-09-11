CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "age" varchar(3);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "year_of_study" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "department" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emergency_contact" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emergency_contact_person" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "degree" varchar(100);