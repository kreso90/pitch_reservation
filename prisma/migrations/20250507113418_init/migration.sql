-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "facilityAddress" TEXT,
ADD COLUMN     "facilityEmail" TEXT,
ADD COLUMN     "facilityFieldTypes" TEXT[],
ADD COLUMN     "facilityTelephone" TEXT;
