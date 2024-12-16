/*
  Warnings:

  - You are about to drop the column `isSuperUser` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isSuperUser",
ADD COLUMN     "identifier" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_identifier_key" ON "User"("identifier");
