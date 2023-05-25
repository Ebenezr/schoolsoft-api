/*
  Warnings:

  - Added the required column `termId` to the `FeePayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeePayment" ADD COLUMN     "termId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
