CREATE TYPE "public"."mood" AS ENUM('happy', 'sad', 'angry', 'surprised', 'disgusted', 'fearful', 'neutral');--> statement-breakpoint
CREATE TABLE "student_moods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"date" timestamp DEFAULT now(),
	"mood" "mood" NOT NULL,
	"mood_score" double precision DEFAULT 0,
	CONSTRAINT "mood_score_range" CHECK ("student_moods"."mood_score" >= 0 AND "student_moods"."mood_score" <= 1)
);
--> statement-breakpoint
ALTER TABLE "student_moods" ADD CONSTRAINT "fk_student_moods_user" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;