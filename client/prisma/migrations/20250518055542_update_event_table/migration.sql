/*
  Warnings:

  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `capacity` VARCHAR(191) NULL,
    ADD COLUMN `endTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `hasCapacity` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasTickets` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isFree` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `requiresApproval` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `timezone` VARCHAR(191) NULL;
