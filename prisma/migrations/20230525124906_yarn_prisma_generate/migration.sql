/*
  Warnings:

  - You are about to drop the column `term_one` on the `ClassFee` table. All the data in the column will be lost.
  - You are about to drop the column `term_three` on the `ClassFee` table. All the data in the column will be lost.
  - You are about to drop the column `term_two` on the `ClassFee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClassFee" DROP COLUMN "term_one",
DROP COLUMN "term_three",
DROP COLUMN "term_two";

-- CreateTable
CREATE TABLE "TermFee" (
    "id" SERIAL NOT NULL,
    "termId" INTEGER NOT NULL,
    "classFeeId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermFee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TermFee" ADD CONSTRAINT "TermFee_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermFee" ADD CONSTRAINT "TermFee_classFeeId_fkey" FOREIGN KEY ("classFeeId") REFERENCES "ClassFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
