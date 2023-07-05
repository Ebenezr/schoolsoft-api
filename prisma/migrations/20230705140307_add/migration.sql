/*
  Warnings:

  - You are about to drop the column `term_1` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `term_2` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `term_3` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `termId` on the `FeePayment` table. All the data in the column will be lost.
  - You are about to drop the `AdditionalFee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdditionalFeeStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Guardian` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentGuardian` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentTermFee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Term` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdditionalFeeStudent" DROP CONSTRAINT "AdditionalFeeStudent_additionalFeeId_fkey";

-- DropForeignKey
ALTER TABLE "AdditionalFeeStudent" DROP CONSTRAINT "AdditionalFeeStudent_studentId_fkey";

-- DropForeignKey
ALTER TABLE "FeePayment" DROP CONSTRAINT "FeePayment_termId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGuardian" DROP CONSTRAINT "StudentGuardian_guardianId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGuardian" DROP CONSTRAINT "StudentGuardian_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTermFee" DROP CONSTRAINT "StudentTermFee_additionalFeeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTermFee" DROP CONSTRAINT "StudentTermFee_classId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTermFee" DROP CONSTRAINT "StudentTermFee_studentId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "term_1",
DROP COLUMN "term_2",
DROP COLUMN "term_3";

-- AlterTable
ALTER TABLE "FeePayment" DROP COLUMN "termId";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "feeAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "feeBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "feePaid" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "guardianName" TEXT,
ADD COLUMN     "guardianPhone" TEXT;

-- DropTable
DROP TABLE "AdditionalFee";

-- DropTable
DROP TABLE "AdditionalFeeStudent";

-- DropTable
DROP TABLE "Guardian";

-- DropTable
DROP TABLE "StudentGuardian";

-- DropTable
DROP TABLE "StudentTermFee";

-- DropTable
DROP TABLE "Term";
