import { Facility, FacilityFields, FieldReservation, SpecialWorkingHours, WorkingHours } from "@prisma/client";

export type FacilityWithFields = Facility & {
    workingHours: WorkingHours[]
    specialWorkingHours: SpecialWorkingHours[],
    facilityFields: (FacilityFields & {
         fieldReservation: FieldReservation[];
    })[];
};