/*
  Warnings:

  - You are about to drop the column `chatId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chatuser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chatuser` DROP FOREIGN KEY `ChatUser_chatId_fkey`;

-- DropForeignKey
ALTER TABLE `chatuser` DROP FOREIGN KEY `ChatUser_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_chatId_fkey`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `chatId`,
    ADD COLUMN `receiverId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `chat`;

-- DropTable
DROP TABLE `chatuser`;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
