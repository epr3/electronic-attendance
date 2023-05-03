/*
  Warnings:

  - You are about to drop the column `has_thesis` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `class_id` on the `events` table. All the data in the column will be lost.
  - The values [EXTRA] on the enum `events_event_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the `extras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[event_id]` on the table `absences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[head_teacher_id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id]` on the table `grades` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `absence_type` to the `absences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_year` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `head_teacher_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_active` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_year` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `classes_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `extras` DROP FOREIGN KEY `extras_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `students_class_id_fkey`;

-- AlterTable
ALTER TABLE `absences` ADD COLUMN `absence_type` ENUM('MEDICAL', 'PARENT', 'TEACHER') NOT NULL;

-- AlterTable
ALTER TABLE `classes` DROP COLUMN `has_thesis`,
    DROP COLUMN `user_id`,
    ADD COLUMN `end_year` INTEGER NOT NULL,
    ADD COLUMN `head_teacher_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL,
    ADD COLUMN `school_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `start_year` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `class_id`,
    ADD COLUMN `subject_id` VARCHAR(191) NOT NULL,
    MODIFY `event_type` ENUM('ABSENCE', 'GRADE') NOT NULL DEFAULT 'GRADE';

-- AlterTable
ALTER TABLE `grades` DROP COLUMN `type`,
    MODIFY `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('SUPERADMIN', 'DIRECTOR', 'ADMIN', 'SUPERVISOR', 'TEACHER', 'STUDENT', 'PARENT') NOT NULL,
    ADD COLUMN `verified_at` DATETIME(3) NULL;

-- DropTable
DROP TABLE `extras`;

-- DropTable
DROP TABLE `students`;

-- CreateTable
CREATE TABLE `approvals` (
    `id` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'DENIED') NOT NULL,
    `requestor_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `approvals_event_id_key`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `absence_docs` (
    `id` VARCHAR(191) NOT NULL,
    `absence_id` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `schoolId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects_teachers_classes` (
    `id` VARCHAR(191) NOT NULL,
    `subjectId` VARCHAR(191) NOT NULL,
    `teacherId` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes_students` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schools` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `county` VARCHAR(191) NOT NULL,
    `director_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `schools_director_id_key`(`director_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parents_students` (
    `id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `parent_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `parents_students_student_id_key`(`student_id`),
    UNIQUE INDEX `parents_students_parent_id_key`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `absences_event_id_key` ON `absences`(`event_id`);

-- CreateIndex
CREATE UNIQUE INDEX `classes_head_teacher_id_key` ON `classes`(`head_teacher_id`);

-- CreateIndex
CREATE UNIQUE INDEX `grades_event_id_key` ON `grades`(`event_id`);

-- AddForeignKey
ALTER TABLE `approvals` ADD CONSTRAINT `approvals_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approvals` ADD CONSTRAINT `approvals_requestor_id_fkey` FOREIGN KEY (`requestor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absence_docs` ADD CONSTRAINT `absence_docs_absence_id_fkey` FOREIGN KEY (`absence_id`) REFERENCES `absences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects_teachers_classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_head_teacher_id_fkey` FOREIGN KEY (`head_teacher_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_students` ADD CONSTRAINT `classes_students_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_students` ADD CONSTRAINT `classes_students_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_director_id_fkey` FOREIGN KEY (`director_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parents_students` ADD CONSTRAINT `parents_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parents_students` ADD CONSTRAINT `parents_students_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
