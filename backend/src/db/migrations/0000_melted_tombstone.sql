CREATE TYPE "public"."role" AS ENUM('student', 'admin');--> statement-breakpoint
CREATE TYPE "public"."mood" AS ENUM('happy', 'sad', 'angry', 'surprised', 'disgusted', 'fearful', 'neutral');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'student' NOT NULL,
	"organization" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact" varchar(20) NOT NULL,
	"id_proof_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "student_moods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"date" timestamp DEFAULT now(),
	"mood" "mood" NOT NULL,
	"mood_score" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mood_score_range" CHECK ("student_moods"."mood_score" >= 0 AND "student_moods"."mood_score" <= 1)
);
--> statement-breakpoint
ALTER TABLE "student_moods" ADD CONSTRAINT "fk_student_moods_user" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;