-- DropForeignKey
ALTER TABLE "PendingRecipe" DROP CONSTRAINT "PendingRecipe_userId_fkey";

-- AlterTable
ALTER TABLE "PendingRecipe" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PendingRecipe" ADD CONSTRAINT "PendingRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
