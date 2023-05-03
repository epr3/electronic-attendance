/*
  Warnings:

  - You are about to drop the column `end_year` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `start_year` on the `classes` table. All the data in the column will be lost.
  - Added the required column `school_year_id` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classes` DROP COLUMN `end_year`,
    DROP COLUMN `start_year`,
    ADD COLUMN `school_year_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `school_years` (
    `id` VARCHAR(191) NOT NULL,
    `school_date_rule` VARCHAR(191) NOT NULL,
    `holiday_date_rule` VARCHAR(191) NOT NULL,
    `school_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_school_year_id_fkey` FOREIGN KEY (`school_year_id`) REFERENCES `school_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_years` ADD CONSTRAINT `school_years_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
