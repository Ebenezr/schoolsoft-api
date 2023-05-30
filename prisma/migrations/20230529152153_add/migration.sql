/*
  Warnings:

  - You are about to drop the column `amount` on the `StudentTermFee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentTermFee" DROP COLUMN "amount",
ADD COLUMN     "amount_paid" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "total_fee" DECIMAL(65,30) NOT NULL DEFAULT 0;
