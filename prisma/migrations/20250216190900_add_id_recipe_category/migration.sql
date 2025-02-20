/*
  Warnings:

  - The primary key for the `PendingRecipeCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RecipeCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[pendingRecipeId,pendingCategoryId]` on the table `PendingRecipeCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,categoryId]` on the table `RecipeCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PendingRecipeCategory" DROP CONSTRAINT "PendingRecipeCategory_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PendingRecipeCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RecipeCategory" DROP CONSTRAINT "RecipeCategory_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "PendingRecipeCategory_pendingRecipeId_pendingCategoryId_key" ON "PendingRecipeCategory"("pendingRecipeId", "pendingCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeCategory_recipeId_categoryId_key" ON "RecipeCategory"("recipeId", "categoryId");
