ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "expires_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_sessions" DROP COLUMN IF EXISTS "active_expires";--> statement-breakpoint
ALTER TABLE "user_sessions" DROP COLUMN IF EXISTS "idle_expires";