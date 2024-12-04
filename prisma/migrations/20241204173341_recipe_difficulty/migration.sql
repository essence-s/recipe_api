/*
  Warnings:

  - The `difficulty` column on the `PendingRecipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `difficulty` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RecipeDifficulty" AS ENUM ('facil', 'medio', 'dificil');

-- AlterTable
ALTER TABLE "PendingRecipe" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "RecipeDifficulty" NOT NULL DEFAULT 'medio';

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "RecipeDifficulty" NOT NULL DEFAULT 'medio';

-- CreateIndex
CREATE INDEX "Recipe_title_difficulty_idx" ON "Recipe"("title", "difficulty");
