/*
  Warnings:

  - You are about to drop the column `leaseMonths` on the `rental_requests` table. All the data in the column will be lost.
  - Added the required column `leaseDays` to the `rental_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_requests" DROP COLUMN "leaseMonths",
ADD COLUMN     "leaseDays" INTEGER NOT NULL;
