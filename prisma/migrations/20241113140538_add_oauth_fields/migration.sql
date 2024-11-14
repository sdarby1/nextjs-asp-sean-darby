-- AlterTable
ALTER TABLE `users` ADD COLUMN `provider` VARCHAR(191) NULL,
    ADD COLUMN `providerAccountId` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `validated` BOOLEAN NOT NULL DEFAULT false;
