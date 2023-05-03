/*
  Warnings:

  - The primary key for the `schools_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `schools_users` table. All the data in the column will be lost.
  - The values [SUPERVISOR] on the enum `schools_users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `schools_users` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `role` ENUM('SUPERADMIN', 'DIRECTOR', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT') NOT NULL,
    ADD PRIMARY KEY (`school_id`, `user_id`);
