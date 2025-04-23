-- DropIndex
DROP INDEX "Facility_facilityId_key";

-- CreateTable
CREATE TABLE "WorkingHours" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialWorkingHours" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "note" TEXT,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SpecialWorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_facilityId_dayOfWeek_key" ON "WorkingHours"("facilityId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialWorkingHours_facilityId_date_key" ON "SpecialWorkingHours"("facilityId", "date");

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("facilityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialWorkingHours" ADD CONSTRAINT "SpecialWorkingHours_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("facilityId") ON DELETE CASCADE ON UPDATE CASCADE;
