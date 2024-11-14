/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationrequest` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `emailVerified`,
    ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `provider` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `verificationrequest`;

-- CreateIndex
CREATE UNIQUE INDEX `User_name_key` ON `User`(`name`);
