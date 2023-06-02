-- DropIndex
DROP INDEX "School_email_key";

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "address2" DROP NOT NULL,
ALTER COLUMN "phone2" DROP NOT NULL;
