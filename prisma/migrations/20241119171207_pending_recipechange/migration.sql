/*
  Warnings:

  - You are about to drop the `PendingCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingCategoryGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PendingCategory" DROP CONSTRAINT "PendingCategory_groupId_fkey";

-- DropForeignKey
ALTER TABLE "PendingRecipeCategory" DROP CONSTRAINT "PendingRecipeCategory_pendingCategoryId_fkey";

-- DropTable
DROP TABLE "PendingCategory";

-- DropTable
DROP TABLE "PendingCategoryGroup";

-- AddForeignKey
ALTER TABLE "PendingRecipeCategory" ADD CONSTRAINT "PendingRecipeCategory_pendingCategoryId_fkey" FOREIGN KEY ("pendingCategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
