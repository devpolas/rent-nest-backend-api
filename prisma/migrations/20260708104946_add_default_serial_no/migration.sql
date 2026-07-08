-- AlterTable
ALTER TABLE "amenities" ADD COLUMN     "amenityNo" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "features" ADD COLUMN     "featureNo" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "property_categories" ADD COLUMN     "categoryNo" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "rules" ADD COLUMN     "ruleNo" SERIAL NOT NULL;
