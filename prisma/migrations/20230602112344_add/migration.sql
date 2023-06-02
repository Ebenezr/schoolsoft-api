/*
  Warnings:

  - You are about to drop the column `additionalFeeStudentId` on the `StudentTermFee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentTermFee" DROP CONSTRAINT "StudentTermFee_additionalFeeStudentId_fkey";

-- AlterTable
ALTER TABLE "StudentTermFee" DROP COLUMN "additionalFeeStudentId",
ADD COLUMN     "additionalFeeId" INTEGER,
ADD COLUMN     "boarding_fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "bus_fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "food_fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "tuition_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "StudentTermFee" ADD CONSTRAINT "StudentTermFee_additionalFeeId_fkey" FOREIGN KEY ("additionalFeeId") REFERENCES "AdditionalFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
