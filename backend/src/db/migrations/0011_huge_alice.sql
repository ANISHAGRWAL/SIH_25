CREATE TABLE "otp" (
	"email" varchar PRIMARY KEY NOT NULL,
	"code" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL
);
