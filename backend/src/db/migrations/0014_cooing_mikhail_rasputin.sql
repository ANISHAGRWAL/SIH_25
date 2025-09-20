CREATE TABLE "volunteer_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_requests" ADD COLUMN "organization_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "volunteer_requests" ADD CONSTRAINT "fk_volunteerRequests_user" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_requests" ADD CONSTRAINT "fk_volunteerRequests_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;