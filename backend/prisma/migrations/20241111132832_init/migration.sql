-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'doctor@medlink.com',
ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'doctor123';
