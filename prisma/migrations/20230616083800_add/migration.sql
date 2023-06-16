-- DropForeignKey
ALTER TABLE "StudentTermFee" DROP CONSTRAINT "StudentTermFee_studentId_fkey";

-- AddForeignKey
ALTER TABLE "StudentTermFee" ADD CONSTRAINT "StudentTermFee_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
