import { Facility, FacilityFields, FieldReservation, HourlyPricing, WorkingHours } from "@prisma/client";

export type FacilityWithFields = Facility & {
    workingHours: WorkingHours[]
    hourlyPricing: HourlyPricing[],
    facilityFields: (FacilityFields & {
         fieldReservation: FieldReservation[];
    })[];
};