/*
  Warnings:

  - Added the required column `end_time` to the `subjects_teachers_classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `subjects_teachers_classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subjects_teachers_classes` ADD COLUMN `end_time` VARCHAR(191) NOT NULL,
    ADD COLUMN `start_time` VARCHAR(191) NOT NULL;
