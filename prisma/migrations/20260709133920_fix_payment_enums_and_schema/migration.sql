/*
  Warnings:

  - You are about to drop the column `paidAt` on the `payments` table. All the data in the column will be lost.
  - Added the required column `expireIn` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'ACTIVE';
ALTER TYPE "PaymentStatus" ADD VALUE 'EXPIRED';

-- DropIndex
DROP INDEX "payments_paidAt_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paidAt",
ADD COLUMN     "expireIn" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "payments_expireIn_idx" ON "payments"("expireIn");

-- CreateIndex
CREATE INDEX "payments_propertyId_idx" ON "payments"("propertyId");

-- CreateIndex
CREATE INDEX "payments_amount_idx" ON "payments"("amount");
