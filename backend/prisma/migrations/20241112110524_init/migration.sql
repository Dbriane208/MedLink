-- AlterTable
ALTER TABLE "Prescription" ALTER COLUMN "medication" DROP NOT NULL,
ALTER COLUMN "dosage" DROP NOT NULL,
ALTER COLUMN "frequency" DROP NOT NULL,
ALTER COLUMN "instructions" DROP NOT NULL;
