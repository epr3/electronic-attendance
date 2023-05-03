/*
  Warnings:

  - You are about to drop the column `school_date_rule` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `holiday_date_rule` on the `school_years` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `classes` DROP COLUMN `school_date_rule`;

-- AlterTable
ALTER TABLE `school_years` DROP COLUMN `holiday_date_rule`;

-- CreateTable
CREATE TABLE `school_year_holidays` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `holiday_date_rule` VARCHAR(191) NOT NULL,
    `school_year_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `school_year_holidays` ADD CONSTRAINT `school_year_holidays_school_year_id_fkey` FOREIGN KEY (`school_year_id`) REFERENCES `school_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
