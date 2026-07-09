/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,propertyId]` on the table `rental_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "rental_requests_propertyId_key";

-- CreateIndex
CREATE UNIQUE INDEX "rental_requests_tenantId_propertyId_key" ON "rental_requests"("tenantId", "propertyId");

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
