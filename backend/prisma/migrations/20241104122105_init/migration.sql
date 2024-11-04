/*
  Warnings:

  - You are about to drop the column `status` on the `Appointment` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `Doctor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'available',
ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);
