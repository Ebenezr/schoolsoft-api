/*
  Warnings:

  - You are about to drop the column `termId` on the `StudentTermFee` table. All the data in the column will be lost.
  - You are about to drop the column `tuition_fee` on the `StudentTermFee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentTermFee" DROP CONSTRAINT "StudentTermFee_termId_fkey";

-- DropIndex
DROP INDEX "StudentTermFee_studentId_classId_termId_key";

-- AlterTable
ALTER TABLE "StudentTermFee" DROP COLUMN "termId",
DROP COLUMN "tuition_fee",
ADD COLUMN     "term_one_balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "term_one_fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "term_three_balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "term_three_fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "term_two_balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "term_two_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;
