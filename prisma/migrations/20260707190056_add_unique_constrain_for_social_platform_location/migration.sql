/*
  Warnings:

  - A unique constraint covering the columns `[type,profileId]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[platform,profileId]` on the table `social_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "locations_type_profileId_key" ON "locations"("type", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "social_profile_platform_profileId_key" ON "social_profile"("platform", "profileId");
