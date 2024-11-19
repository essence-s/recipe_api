/*
  Warnings:

  - You are about to drop the column `authorId` on the `PendingRecipe` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `userId` to the `PendingRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PendingRecipe" DROP CONSTRAINT "PendingRecipe_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_authorId_fkey";

-- AlterTable
ALTER TABLE "PendingRecipe" DROP COLUMN "authorId",
ADD COLUMN     "publicUserName" TEXT,
ADD COLUMN     "publicUserPhone" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "authorId",
ADD COLUMN     "publicUserName" TEXT,
ADD COLUMN     "publicUserPhone" TEXT,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingRecipe" ADD CONSTRAINT "PendingRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
