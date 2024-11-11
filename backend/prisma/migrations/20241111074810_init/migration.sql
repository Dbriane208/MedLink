-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'doctor@medlink.com',
ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'doctor1234',
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3),
ALTER COLUMN "specialization" SET DEFAULT 'General';
