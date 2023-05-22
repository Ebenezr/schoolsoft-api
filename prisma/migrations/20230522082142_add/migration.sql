/*
  Warnings:

  - Added the required column `classId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdditionalFeeStudent" DROP CONSTRAINT "AdditionalFeeStudent_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ClassFee" DROP CONSTRAINT "ClassFee_classId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "classId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFee" ADD CONSTRAINT "ClassFee_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalFeeStudent" ADD CONSTRAINT "AdditionalFeeStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
