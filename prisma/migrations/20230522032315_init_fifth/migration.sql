/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Variant_sku_key" ON "Variant"("sku");
