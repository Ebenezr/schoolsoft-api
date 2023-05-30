/*
  Warnings:

  - You are about to drop the column `additionalFeeId` on the `StudentTermFee` table. All the data in the column will be lost.
  - Added the required column `additionalFeeStudentId` to the `StudentTermFee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentTermFee" DROP CONSTRAINT "StudentTermFee_additionalFeeId_fkey";

-- AlterTable
ALTER TABLE "StudentTermFee" DROP COLUMN "additionalFeeId",
ADD COLUMN     "additionalFeeStudentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentTermFee" ADD CONSTRAINT "StudentTermFee_additionalFeeStudentId_fkey" FOREIGN KEY ("additionalFeeStudentId") REFERENCES "AdditionalFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
