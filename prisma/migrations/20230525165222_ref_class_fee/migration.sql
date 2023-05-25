/*
  Warnings:

  - You are about to drop the column `classFeeId` on the `FeePayment` table. All the data in the column will be lost.
  - You are about to drop the column `classFeeId` on the `StudentTermFee` table. All the data in the column will be lost.
  - You are about to drop the column `classFeeId` on the `TermFee` table. All the data in the column will be lost.
  - You are about to drop the `ClassFee` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classId` to the `FeePayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `StudentTermFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `TermFee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassFee" DROP CONSTRAINT "ClassFee_classId_fkey";

-- DropForeignKey
ALTER TABLE "FeePayment" DROP CONSTRAINT "FeePayment_classFeeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTermFee" DROP CONSTRAINT "StudentTermFee_classFeeId_fkey";

-- DropForeignKey
ALTER TABLE "TermFee" DROP CONSTRAINT "TermFee_classFeeId_fkey";

-- AlterTable
ALTER TABLE "FeePayment" DROP COLUMN "classFeeId",
ADD COLUMN     "classId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StudentTermFee" DROP COLUMN "classFeeId",
ADD COLUMN     "classId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TermFee" DROP COLUMN "classFeeId",
ADD COLUMN     "classId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ClassFee";

-- AddForeignKey
ALTER TABLE "TermFee" ADD CONSTRAINT "TermFee_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTermFee" ADD CONSTRAINT "StudentTermFee_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
