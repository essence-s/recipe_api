/*
  Warnings:

  - You are about to drop the column `difficulty` on the `PendingRecipe` table. All the data in the column will be lost.
  - You are about to drop the column `prepTime` on the `PendingRecipe` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `prepTime` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Recipe_title_difficulty_idx";

-- AlterTable
ALTER TABLE "PendingRecipe" DROP COLUMN "difficulty",
DROP COLUMN "prepTime";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "difficulty",
DROP COLUMN "prepTime";

-- CreateIndex
CREATE INDEX "Recipe_title_idx" ON "Recipe"("title");
