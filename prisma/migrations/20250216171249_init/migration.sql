/*
  Warnings:

  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_classId_fkey";

-- DropTable
DROP TABLE "Exam";

-- CreateTable
CREATE TABLE "_AdmissionToStudent" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdmissionToStudent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AdmissionToStudent_B_index" ON "_AdmissionToStudent"("B");

-- AddForeignKey
ALTER TABLE "_AdmissionToStudent" ADD CONSTRAINT "_AdmissionToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Admission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdmissionToStudent" ADD CONSTRAINT "_AdmissionToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
