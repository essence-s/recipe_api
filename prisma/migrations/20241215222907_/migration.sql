/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "identifier" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Role_identifier_key" ON "Role"("identifier");
