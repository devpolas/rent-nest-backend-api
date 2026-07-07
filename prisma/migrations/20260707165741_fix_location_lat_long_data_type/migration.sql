/*
  Warnings:

  - Made the column `latitude` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `locations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "latitude" SET DATA TYPE TEXT,
ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "longitude" SET DATA TYPE TEXT;
