/*
  Warnings:

  - Added the required column `groupId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PendingRecipeCategory" DROP CONSTRAINT "PendingRecipeCategory_pendingCategoryId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "groupId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PendingRecipe" ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "CategoryGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingCategoryGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PendingCategoryGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "PendingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryGroup_name_key" ON "CategoryGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PendingCategoryGroup_name_key" ON "PendingCategoryGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PendingCategory_name_key" ON "PendingCategory"("name");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CategoryGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingCategory" ADD CONSTRAINT "PendingCategory_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "PendingCategoryGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingRecipeCategory" ADD CONSTRAINT "PendingRecipeCategory_pendingCategoryId_fkey" FOREIGN KEY ("pendingCategoryId") REFERENCES "PendingCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
