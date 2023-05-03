-- DropForeignKey
ALTER TABLE `absence_docs` DROP FOREIGN KEY `absence_docs_absence_id_fkey`;

-- DropForeignKey
ALTER TABLE `approvals` DROP FOREIGN KEY `approvals_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `approvals` DROP FOREIGN KEY `approvals_requestor_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `classes_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes_students` DROP FOREIGN KEY `classes_students_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `classes_students` DROP FOREIGN KEY `classes_students_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `grades` DROP FOREIGN KEY `grades_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `parents_students` DROP FOREIGN KEY `parents_students_parent_id_fkey`;

-- DropForeignKey
ALTER TABLE `parents_students` DROP FOREIGN KEY `parents_students_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `school_years` DROP FOREIGN KEY `school_years_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `schools_users` DROP FOREIGN KEY `schools_users_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `schools_users` DROP FOREIGN KEY `schools_users_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `subjects_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjects_students` DROP FOREIGN KEY `subjects_students_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjects_students` DROP FOREIGN KEY `subjects_students_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjects_teachers_classes` DROP FOREIGN KEY `subjects_teachers_classes_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjects_teachers_classes` DROP FOREIGN KEY `subjects_teachers_classes_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjects_teachers_classes` DROP FOREIGN KEY `subjects_teachers_classes_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `tokens` DROP FOREIGN KEY `tokens_email_fkey`;

-- DropForeignKey
ALTER TABLE `user_passports` DROP FOREIGN KEY `user_passports_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `approvals` ADD CONSTRAINT `approvals_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approvals` ADD CONSTRAINT `approvals_requestor_id_fkey` FOREIGN KEY (`requestor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grades` ADD CONSTRAINT `grades_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absence_docs` ADD CONSTRAINT `absence_docs_absence_id_fkey` FOREIGN KEY (`absence_id`) REFERENCES `absences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects_teachers_classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_students` ADD CONSTRAINT `subjects_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_students` ADD CONSTRAINT `subjects_students_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects_teachers_classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_students` ADD CONSTRAINT `classes_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_students` ADD CONSTRAINT `classes_students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_email_fkey` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parents_students` ADD CONSTRAINT `parents_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parents_students` ADD CONSTRAINT `parents_students_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_years` ADD CONSTRAINT `school_years_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_passports` ADD CONSTRAINT `user_passports_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools_users` ADD CONSTRAINT `schools_users_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools_users` ADD CONSTRAINT `schools_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
