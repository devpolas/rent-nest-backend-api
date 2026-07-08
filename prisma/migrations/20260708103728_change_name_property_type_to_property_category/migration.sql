/*
  Warnings:

  - You are about to drop the column `propertyTypeId` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `property_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_propertyTypeId_fkey";

-- DropIndex
DROP INDEX "properties_propertyTypeId_idx";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "propertyTypeId",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "property_types";

-- CreateTable
CREATE TABLE "property_categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "property_categories_name_key" ON "property_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "property_categories_slug_key" ON "property_categories"("slug");

-- CreateIndex
CREATE INDEX "property_categories_name_idx" ON "property_categories"("name");

-- CreateIndex
CREATE INDEX "property_categories_slug_idx" ON "property_categories"("slug");

-- CreateIndex
CREATE INDEX "properties_categoryId_idx" ON "properties"("categoryId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "property_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
