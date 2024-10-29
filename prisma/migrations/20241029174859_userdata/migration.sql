/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "Role" ADD COLUMN     "permission" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "User" 
ADD COLUMN "phone" TEXT NOT NULL DEFAULT 'temp-phone',
ADD COLUMN "state" TEXT NOT NULL DEFAULT 'active';

-- ALTER COLUMN "email" DROP NOT NULL;

-- ALTER TABLE "User" ALTER COLUMN "phone" DROP DEFAULT;

DO $$ 
DECLARE
    user_record RECORD;
    counter INTEGER := 1;
BEGIN
    FOR user_record IN SELECT * FROM "User" LOOP
        UPDATE "User"
        SET "phone" = '999' || counter::text  -- Asigna valores únicos, por ejemplo: '9991', '9992', etc.
        WHERE "id" = user_record.id;
        counter := counter + 1;
    END LOOP;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
