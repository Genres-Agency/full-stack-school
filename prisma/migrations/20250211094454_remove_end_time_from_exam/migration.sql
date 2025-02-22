/*
  Warnings:

  - You are about to drop the column `date` on the `ExamRoutine` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `ExamRoutine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamRoutine" DROP COLUMN "date",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
