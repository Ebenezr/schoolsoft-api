/*
  Warnings:

  - You are about to drop the `TermFee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TermFee" DROP CONSTRAINT "TermFee_classId_fkey";

-- DropForeignKey
ALTER TABLE "TermFee" DROP CONSTRAINT "TermFee_termId_fkey";

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "term_1" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "term_2" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "term_3" DECIMAL(65,30) DEFAULT 0;

-- DropTable
DROP TABLE "TermFee";
