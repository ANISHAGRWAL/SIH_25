CREATE TYPE "public"."session_mode" AS ENUM('virtual', 'physical');--> statement-breakpoint
CREATE TYPE "public"."session_type" AS ENUM('individual-counseling', 'crisis-support', 'academic-stress', 'anxiety-depression', 'relationship-issues', 'career-guidance', 'trauma-support', 'group-therapy', 'other');--> statement-breakpoint
CREATE TYPE "public"."urgency" AS ENUM('routine', 'priority', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'completed', 'cancelled', 'rejected');--> statement-breakpoint
CREATE TABLE "session_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"session_type" "session_type" NOT NULL,
	"reason" text NOT NULL,
	"mode" "session_mode" NOT NULL,
	"urgency" "urgency" NOT NULL,
	"preferred_date" date NOT NULL,
	"preferred_time" time NOT NULL,
	"additional_notes" text,
	"status" text DEFAULT 'pending',
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
