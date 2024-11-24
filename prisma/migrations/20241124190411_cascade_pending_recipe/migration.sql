-- DropForeignKey
ALTER TABLE "PendingRecipeCategory" DROP CONSTRAINT "PendingRecipeCategory_pendingRecipeId_fkey";

-- DropForeignKey
ALTER TABLE "PendingRecipeIngredient" DROP CONSTRAINT "PendingRecipeIngredient_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "PendingRecipeInstruction" DROP CONSTRAINT "PendingRecipeInstruction_recipeId_fkey";

-- AddForeignKey
ALTER TABLE "PendingRecipeInstruction" ADD CONSTRAINT "PendingRecipeInstruction_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "PendingRecipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingRecipeIngredient" ADD CONSTRAINT "PendingRecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "PendingRecipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingRecipeCategory" ADD CONSTRAINT "PendingRecipeCategory_pendingRecipeId_fkey" FOREIGN KEY ("pendingRecipeId") REFERENCES "PendingRecipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
