-- CreateTable
CREATE TABLE "Facility" (
    "facilityId" TEXT NOT NULL,
    "facilityAdminId" TEXT NOT NULL,
    "facilityAdmin" TEXT NOT NULL,
    "workingHoursStart" TIMESTAMP(3) NOT NULL,
    "workingHoursEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("facilityId")
);

-- CreateTable
CREATE TABLE "FacilityFields" (
    "facilityFacilityId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,

    CONSTRAINT "FacilityFields_pkey" PRIMARY KEY ("facilityFacilityId")
);

-- CreateTable
CREATE TABLE "FieldReservation" (
    "fieldReservationId" TEXT NOT NULL,
    "reservationName" TEXT NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL,
    "reservationTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldReservation_pkey" PRIMARY KEY ("fieldReservationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facility_facilityId_key" ON "Facility"("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_facilityAdminId_key" ON "Facility"("facilityAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "FacilityFields_facilityFacilityId_key" ON "FacilityFields"("facilityFacilityId");

-- CreateIndex
CREATE UNIQUE INDEX "FieldReservation_fieldReservationId_key" ON "FieldReservation"("fieldReservationId");

-- AddForeignKey
ALTER TABLE "FacilityFields" ADD CONSTRAINT "FacilityFields_facilityFacilityId_fkey" FOREIGN KEY ("facilityFacilityId") REFERENCES "Facility"("facilityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldReservation" ADD CONSTRAINT "FieldReservation_fieldReservationId_fkey" FOREIGN KEY ("fieldReservationId") REFERENCES "FacilityFields"("facilityFacilityId") ON DELETE CASCADE ON UPDATE CASCADE;
