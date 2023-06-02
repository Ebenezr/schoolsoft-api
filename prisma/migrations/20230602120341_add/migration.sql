/*
  Warnings:

  - A unique constraint covering the columns `[studentId,classId]` on the table `StudentTermFee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentTermFee_studentId_classId_key" ON "StudentTermFee"("studentId", "classId");
