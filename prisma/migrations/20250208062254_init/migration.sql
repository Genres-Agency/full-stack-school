/*
  Warnings:

  - You are about to drop the column `userId` on the `Payment` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NotPaid', 'Paid');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "userId",
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL;
