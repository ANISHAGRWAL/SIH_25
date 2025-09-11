CREATE TABLE "phq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"taken_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gad" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"taken_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pss" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"taken_on" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "phq" ADD CONSTRAINT "fk_phq_user" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "gad" ADD CONSTRAINT "fk_gad_user" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pss" ADD CONSTRAINT "fk_pss_user" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;