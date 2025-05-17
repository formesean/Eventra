/*
  Warnings:

  - Added the required column `attendees` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizer` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `attendees` INTEGER NOT NULL,
    ADD COLUMN `day` VARCHAR(191) NOT NULL,
    ADD COLUMN `organizer` VARCHAR(191) NOT NULL,
    ADD COLUMN `time` VARCHAR(191) NOT NULL;
