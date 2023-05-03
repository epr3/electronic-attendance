/*
  Warnings:

  - You are about to drop the column `classId` on the `classes_students` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `classes_students` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `subjects_teachers_classes` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `subjects_teachers_classes` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `subjects_teachers_classes` table. All the data in the column will be lost.
  - You are about to drop the `SubjectStudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class_id` to the `classes_students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `classes_students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `subjects_teachers_classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `subjects_teachers_classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `subjects_teachers_classes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `SubjectStudent` DROP FOREIGN KEY `SubjectStudent_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `SubjectStudent` DROP FOREIGN KEY `SubjectStudent_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `classes_students` DROP FOREIGN KEY `classes_students_classId_fkey`;

-- DropForeignKey
ALTER TABLE `classes_students` DROP FOREIGN KEY `classes_students_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `subjects_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `subjects_teachers_classes` DROP FOREIGN KEY `subjects_teachers_classes_classId_fkey`;

-- DropForeignKey
ALTER TABLE `subjects_teachers_classes` DROP FOREIGN KEY `subjects_teachers_classes_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `subjects_teachers_classes` DROP FOREIGN KEY `subjects_teachers_classes_teacherId_fkey`;

-- AlterTable
ALTER TABLE `classes_students` DROP COLUMN `classId`,
    DROP COLUMN `studentId`,
    ADD COLUMN `class_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `student_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `schools` ADD COLUMN `logo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `subjects` DROP COLUMN `schoolId`,
    ADD COLUMN `school_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subjects_teachers_classes` DROP COLUMN `classId`,
    DROP COLUMN `subjectId`,
    DROP COLUMN `teacherId`,
    ADD COLUMN `class_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `subject_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `teacher_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `SubjectStudent`;

-- CreateTable
CREATE TABLE `subjects_students` (
    `id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `subjects_students_student_id_key`(`student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_students` ADD CONSTRAINT `subjects_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_students` ADD CONSTRAINT `subjects_students_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects_teachers_classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects_teachers_classes` ADD CONSTRAINT `subjects_teachers_classes_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_students` ADD CONSTRAINT `classes_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes_students` ADD CONSTRAINT `classes_students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
