/*
  Warnings:

  - You are about to drop the column `relationship` on the `Guardian` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Guardian` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Guardian" DROP CONSTRAINT "Guardian_studentId_fkey";

-- AlterTable
ALTER TABLE "Guardian" DROP COLUMN "relationship",
DROP COLUMN "studentId";

-- CreateTable
CREATE TABLE "StudentGuardian" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "guardianId" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentGuardian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentGuardian" ADD CONSTRAINT "StudentGuardian_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGuardian" ADD CONSTRAINT "StudentGuardian_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
