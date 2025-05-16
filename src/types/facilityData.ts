import { Facility, FacilityFields, FieldReservation, HourlyPricing, User, WorkingHours } from "@prisma/client";

export type FacilityWithUser =  {
    facility: FacilityWithFields,
    user: UserWithReservations
};

export type FacilityWithFields = Facility & {
    workingHours: WorkingHours[]
    hourlyPricing: HourlyPricing[],
    facilityFields: (FacilityFields & {
         fieldReservation: FieldReservation[];
    })[];
};

export type UserWithReservations = User & {
  fieldReservation: FieldReservation[];
};

export type FacilitiesAndUserData = {
  facilities: Facility[];
  user: UserWithReservations;
}
