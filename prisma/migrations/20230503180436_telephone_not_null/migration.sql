/*
  Warnings:

  - Made the column `telephone` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `telephone` VARCHAR(191) NOT NULL;
