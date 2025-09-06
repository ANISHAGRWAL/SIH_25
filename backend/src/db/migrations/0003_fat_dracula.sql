ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "student_moods" ADD COLUMN "created_at" timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "student_moods" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;