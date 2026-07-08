-- CreateIndex
CREATE INDEX "amenities_amenityNo_idx" ON "amenities"("amenityNo");

-- CreateIndex
CREATE INDEX "amenities_slug_idx" ON "amenities"("slug");

-- CreateIndex
CREATE INDEX "amenities_name_idx" ON "amenities"("name");

-- CreateIndex
CREATE INDEX "features_featureNo_idx" ON "features"("featureNo");

-- CreateIndex
CREATE INDEX "features_slug_idx" ON "features"("slug");

-- CreateIndex
CREATE INDEX "features_name_idx" ON "features"("name");

-- CreateIndex
CREATE INDEX "property_categories_categoryNo_idx" ON "property_categories"("categoryNo");

-- CreateIndex
CREATE INDEX "rules_ruleNo_idx" ON "rules"("ruleNo");

-- CreateIndex
CREATE INDEX "rules_slug_idx" ON "rules"("slug");

-- CreateIndex
CREATE INDEX "rules_name_idx" ON "rules"("name");
