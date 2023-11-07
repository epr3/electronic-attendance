ALTER TABLE "class_student" RENAME TO "classes_students";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "classes_students" DROP CONSTRAINT "class_student_class_id_classes_id_fk";
--> statement-breakpoint
ALTER TABLE "classes_students" DROP CONSTRAINT "class_student_student_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "school_users" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "mfa_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mfa_enabled" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes_students" ADD CONSTRAINT "classes_students_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes_students" ADD CONSTRAINT "classes_students_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
