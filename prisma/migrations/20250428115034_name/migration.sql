/*
  Warnings:

  - You are about to drop the `SpecialWorkingHours` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[facilityId,dayOfWeek,fieldId]` on the table `WorkingHours` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SpecialWorkingHours" DROP CONSTRAINT "SpecialWorkingHours_facilityId_fkey";

-- DropIndex
DROP INDEX "WorkingHours_facilityId_dayOfWeek_key";

-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "facilityDesc" TEXT,
ADD COLUMN     "facilityName" TEXT,
ALTER COLUMN "workingHoursStart" SET DATA TYPE TEXT,
ALTER COLUMN "workingHoursEnd" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FacilityFields" ADD COLUMN     "fieldPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "WorkingHours" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "fieldId" TEXT,
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "dayOfWeek" DROP NOT NULL;

-- DropTable
DROP TABLE "SpecialWorkingHours";

-- CreateTable
CREATE TABLE "HourlyPricing" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "fieldId" TEXT,
    "date" TIMESTAMP(3),
    "dayOfWeek" INTEGER,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HourlyPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HourlyPricing_facilityId_fieldId_idx" ON "HourlyPricing"("facilityId", "fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_facilityId_dayOfWeek_fieldId_key" ON "WorkingHours"("facilityId", "dayOfWeek", "fieldId");

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "FacilityFields"("fieldId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyPricing" ADD CONSTRAINT "HourlyPricing_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("facilityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyPricing" ADD CONSTRAINT "HourlyPricing_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "FacilityFields"("fieldId") ON DELETE CASCADE ON UPDATE CASCADE;
