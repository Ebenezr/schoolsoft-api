/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Term` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Term_name_key" ON "Term"("name");
