-- AlterTable
ALTER TABLE "StudentTermFee" ADD COLUMN     "term_one_paid" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "term_three_paid" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "term_two_paid" DECIMAL(65,30) NOT NULL DEFAULT 0;
