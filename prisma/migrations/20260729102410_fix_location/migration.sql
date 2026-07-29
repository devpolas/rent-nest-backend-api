-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "profileId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "locations_type_idx" ON "locations"("type");

-- CreateIndex
CREATE INDEX "locations_country_division_district_city_idx" ON "locations"("country", "division", "district", "city");
