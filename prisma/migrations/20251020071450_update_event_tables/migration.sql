/*
  Warnings:

  - You are about to drop the column `allDay` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `proposedTimes` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `events` table. All the data in the column will be lost.
  - Added the required column `link` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('HALF', 'HOUR');

-- CreateEnum
CREATE TYPE "PriorityStatus" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TimeZone" AS ENUM ('UTC', 'GMT', 'WIB', 'WITA', 'WIT', 'PST', 'EST', 'CET', 'JST', 'AEST');

-- AlterTable
ALTER TABLE "events" DROP COLUMN "allDay",
DROP COLUMN "endDate",
DROP COLUMN "location",
DROP COLUMN "proposedTimes",
DROP COLUMN "startDate",
ADD COLUMN     "availableTimes" TIMESTAMP(3)[],
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimatedTime" "Duration" NOT NULL DEFAULT 'HALF',
ADD COLUMN     "priority" "PriorityStatus" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "timezone" "TimeZone" NOT NULL DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "link" TEXT NOT NULL;
