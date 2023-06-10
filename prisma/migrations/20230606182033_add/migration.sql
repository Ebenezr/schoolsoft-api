/*
  Warnings:

  - You are about to drop the column `term1_fee` on the `StudentTermFee` table. All the data in the column will be lost.
  - You are about to drop the column `term2_fee` on the `StudentTermFee` table. All the data in the column will be lost.
  - You are about to drop the column `term3_fee` on the `StudentTermFee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,classId,termId]` on the table `StudentTermFee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `termId` to the `StudentTermFee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "StudentTermFee_studentId_classId_key";

-- AlterTable
ALTER TABLE "StudentTermFee" DROP COLUMN "term1_fee",
DROP COLUMN "term2_fee",
DROP COLUMN "term3_fee",
ADD COLUMN     "termId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentTermFee_studentId_classId_termId_key" ON "StudentTermFee"("studentId", "classId", "termId");

-- AddForeignKey
ALTER TABLE "StudentTermFee" ADD CONSTRAINT "StudentTermFee_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
