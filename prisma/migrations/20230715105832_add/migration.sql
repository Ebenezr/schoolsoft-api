/*
  Warnings:

  - You are about to drop the column `bankInfo2` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `bankInfo3` on the `School` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "School" DROP COLUMN "bankInfo2",
DROP COLUMN "bankInfo3",
ADD COLUMN     "bankAcc" TEXT,
ADD COLUMN     "bankName" TEXT;
