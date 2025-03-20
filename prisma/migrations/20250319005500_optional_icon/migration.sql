-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "icon" TEXT;

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");
