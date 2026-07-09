/*
  Warnings:

  - Added the required column `propertyId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "propertyId" TEXT NOT NULL;
