/*
  Warnings:

  - The primary key for the `FacilityFields` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `facilityFacilityId` on the `FacilityFields` table. All the data in the column will be lost.
  - The primary key for the `FieldReservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `facilityFieldId` to the `FacilityFields` table without a default value. This is not possible if the table is not empty.
  - The required column `fieldId` was added to the `FacilityFields` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `reservationId` was added to the `FieldReservation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `FieldReservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FacilityFields" DROP CONSTRAINT "FacilityFields_facilityFacilityId_fkey";

-- DropForeignKey
ALTER TABLE "FieldReservation" DROP CONSTRAINT "FieldReservation_fieldReservationId_fkey";

-- DropIndex
DROP INDEX "FacilityFields_facilityFacilityId_key";

-- DropIndex
DROP INDEX "FieldReservation_fieldReservationId_key";

-- AlterTable
ALTER TABLE "FacilityFields" DROP CONSTRAINT "FacilityFields_pkey",
DROP COLUMN "facilityFacilityId",
ADD COLUMN     "facilityFieldId" TEXT NOT NULL,
ADD COLUMN     "fieldId" TEXT NOT NULL,
ADD CONSTRAINT "FacilityFields_pkey" PRIMARY KEY ("fieldId");

-- AlterTable
ALTER TABLE "FieldReservation" DROP CONSTRAINT "FieldReservation_pkey",
ADD COLUMN     "reservationId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "FieldReservation_pkey" PRIMARY KEY ("reservationId");

-- AddForeignKey
ALTER TABLE "FacilityFields" ADD CONSTRAINT "FacilityFields_facilityFieldId_fkey" FOREIGN KEY ("facilityFieldId") REFERENCES "Facility"("facilityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldReservation" ADD CONSTRAINT "FieldReservation_fieldReservationId_fkey" FOREIGN KEY ("fieldReservationId") REFERENCES "FacilityFields"("fieldId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldReservation" ADD CONSTRAINT "FieldReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
