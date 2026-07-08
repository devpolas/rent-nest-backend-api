-- DropForeignKey
ALTER TABLE "property_amenities" DROP CONSTRAINT "property_amenities_amenityId_fkey";

-- DropForeignKey
ALTER TABLE "property_amenities" DROP CONSTRAINT "property_amenities_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "property_features" DROP CONSTRAINT "property_features_featureId_fkey";

-- DropForeignKey
ALTER TABLE "property_features" DROP CONSTRAINT "property_features_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "property_rules" DROP CONSTRAINT "property_rules_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "property_rules" DROP CONSTRAINT "property_rules_ruleId_fkey";

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_rules" ADD CONSTRAINT "property_rules_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_rules" ADD CONSTRAINT "property_rules_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
