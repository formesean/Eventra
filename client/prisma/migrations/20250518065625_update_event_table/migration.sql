/*
  Warnings:

  - You are about to drop the column `day` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `day`,
    DROP COLUMN `time`;
