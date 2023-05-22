/*
  Warnings:

  - You are about to drop the column `orderId` on the `Variant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_orderId_fkey";

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "_OrderToVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToVariant_AB_unique" ON "_OrderToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToVariant_B_index" ON "_OrderToVariant"("B");

-- AddForeignKey
ALTER TABLE "_OrderToVariant" ADD CONSTRAINT "_OrderToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToVariant" ADD CONSTRAINT "_OrderToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
