/*
  Warnings:

  - You are about to drop the column `county` on the `schools` table. All the data in the column will be lost.
  - Added the required column `acronym` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `holiday_date_rule` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_date_rule` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calendar_rule` to the `subjects_teachers_classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classes` ADD COLUMN `school_date_rule` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `grades` ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `schools` DROP COLUMN `county`,
    ADD COLUMN `acronym` VARCHAR(191) NOT NULL,
    ADD COLUMN `holiday_date_rule` VARCHAR(191) NOT NULL,
    ADD COLUMN `school_date_rule` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subjects_teachers_classes` ADD COLUMN `calendar_rule` VARCHAR(191) NOT NULL;
