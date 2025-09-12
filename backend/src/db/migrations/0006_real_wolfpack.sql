CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"content" text NOT NULL,
	"mood_disturbance" integer,
	"sleep_disruption" integer,
	"appetite_issues" integer,
	"academic_disengagement" integer,
	"social_withdrawal" integer,
	"taken_on" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "fk_journal_entries_user" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;