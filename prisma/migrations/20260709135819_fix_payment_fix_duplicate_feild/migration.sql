/*
  Warnings:

  - You are about to drop the column `paymentIntentId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[propertyId,tenantId,status]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentIntentId";

-- CreateIndex
CREATE UNIQUE INDEX "payments_propertyId_tenantId_status_key" ON "payments"("propertyId", "tenantId", "status");
