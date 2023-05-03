/*
  Warnings:

  - The primary key for the `classes_students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `classes_students` table. All the data in the column will be lost.
  - The primary key for the `parents_students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `parents_students` table. All the data in the column will be lost.
  - The primary key for the `subjects_students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `subjects_students` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `classes_students` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`student_id`, `class_id`);

-- AlterTable
ALTER TABLE `parents_students` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`student_id`, `parent_id`);

-- AlterTable
ALTER TABLE `subjects_students` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`student_id`, `subject_id`);
