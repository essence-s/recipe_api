-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "permission" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP DEFAULT;
