/*
  Warnings:

  - Added the required column `passport_type` to the `user_passports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_passports` ADD COLUMN `passport_type` ENUM('PASSWORD', 'GOOGLE') NOT NULL;
