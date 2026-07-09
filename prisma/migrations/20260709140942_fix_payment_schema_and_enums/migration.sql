/*
  Warnings:

  - The values [ACTIVE] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED');
ALTER TABLE "public"."payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'SUCCESS';
COMMIT;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'SUCCESS';

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");
