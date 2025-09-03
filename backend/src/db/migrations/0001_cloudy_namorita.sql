CREATE TYPE "public"."role" AS ENUM('student', 'admin');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'student' NOT NULL;