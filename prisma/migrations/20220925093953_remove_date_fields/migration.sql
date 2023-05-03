/*
  Warnings:

  - You are about to drop the column `director_id` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `holiday_date_rule` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `school_date_rule` on the `schools` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `schools_director_id_key` ON `schools`;

-- AlterTable
ALTER TABLE `schools` DROP COLUMN `director_id`,
    DROP COLUMN `holiday_date_rule`,
    DROP COLUMN `school_date_rule`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `telephone` VARCHAR(191) NULL;
