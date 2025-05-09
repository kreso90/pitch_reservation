import { FacilityFields, FieldReservation, HourlyPricing, WorkingHours } from "@prisma/client";

export function isSlotReserved(reservations: FieldReservation[], dateToCheck: Date): boolean {
    return reservations.some(res => {
        const start = new Date(res.reservationStartTime).getTime();
        const end = new Date(res.reservationEndTime).getTime();
        const check = dateToCheck.getTime();

        return check >= start && check < end;
    });
};

export function isPrevDate(dateToCheck: Date): boolean {
  const currentTime = new Date().getTime();
  return dateToCheck.getTime() < currentTime;   
};


export const getReservationInfo = (
    reservations: FieldReservation[],
    dateToCheck: Date,
    userId: string
  ): { reservationId: string; userId: string; isReservedByUser: boolean; } | null => {
    const check = dateToCheck.getTime();

    for (const res of reservations) {
        const start = new Date(res.reservationStartTime).getTime();
        const end = new Date(res.reservationEndTime).getTime();
  
        if (check >= start && check < end) {
            return {
                reservationId: res.reservationId,
                userId: res.userId,
                isReservedByUser: String(userId) === String(res.userId),
            };
        }
    }
  
    return null;
};

export const getHourStreakPosition = (
    reservations: FieldReservation[],
    dateToCheck: Date
  ): "top" | "middle" | "end" | null => {
    const check = dateToCheck.getTime();
    const oneHour = 60 * 60 * 1000;
  
    for (const res of reservations) {
      const start = new Date(res.reservationStartTime).getTime();
      const end = new Date(res.reservationEndTime).getTime();
  
      if (end - start === oneHour) {
        continue;
      }
  
      if (check === start) {
        return "top";
      } else if (check > start && check < end - oneHour) {
        return "middle";
      } else if (check === end - oneHour) {
        return "end";
      }
    }
  
    return null;
  };

export function getDayWorkingHours(
    dayStartHour: string,
    dayEndHour: string
): number[] {

    const startHour = parseInt(dayStartHour.split(':')[0]);
    const endHour = parseInt(dayEndHour.split(':')[0]);
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  
    return hours;
}

export function getPriceForHour(
    fields: FacilityFields[],
    hourlyPricing: HourlyPricing[],
    day: Date,
    hour: number,
    selectedFieldId?: string
): number {

    const specificDatePriceEntry = 
        hourlyPricing.find(p =>  
            p.date && isSameDate(new Date(p.date), day) &&
            (p.fieldId === selectedFieldId) &&
            hour >= parseInt(p.startTime.split(':')[0]) &&
            hour <= parseInt(p.endTime.split(':')[0])
        ) ??
        hourlyPricing.find(p =>  
            p.date && isSameDate(new Date(p.date), day) &&
            (p.fieldId === null) &&
            hour >= parseInt(p.startTime.split(':')[0]) &&
            hour <= parseInt(p.endTime.split(':')[0])
        );

    if (specificDatePriceEntry) {
        return specificDatePriceEntry.price ?? 40;
    }

    const dayOfWeekPriceEntry = 
        hourlyPricing.find(p =>  
            p.dayOfWeek === (day.getDay() + 6) % 7 &&
            p.date === null &&
            (p.fieldId === selectedFieldId) &&
            hour >= parseInt(p.startTime.split(':')[0]) &&
            hour <= parseInt(p.endTime.split(':')[0])
        ) ??
        hourlyPricing.find(p =>  
            p.dayOfWeek === (day.getDay() + 6) % 7 &&
            p.date === null &&
            (p.fieldId === null) &&
            hour >= parseInt(p.startTime.split(':')[0]) &&
            hour <= parseInt(p.endTime.split(':')[0])
        );

    if (dayOfWeekPriceEntry) {
        return dayOfWeekPriceEntry.price ?? 40;
    }

    const allDaysPriceEntry = 
        hourlyPricing.find(p =>  
            p.dayOfWeek === null &&
            p.date === null &&
            (p.fieldId === selectedFieldId) &&
            hour >= parseInt(p.startTime.split(':')[0]) &&
            hour <= parseInt(p.endTime.split(':')[0])
        ) ??
        hourlyPricing.find(p =>  
            p.dayOfWeek === null &&
            p.date === null &&
            (p.fieldId === null) &&
            hour >= parseInt(p.startTime.split(':')[0]) &&
            hour <= parseInt(p.endTime.split(':')[0])
        );

    if (allDaysPriceEntry) {
        return allDaysPriceEntry.price ?? 40;
    }

    const defualtPrice =  fields.find(p =>  
        (p.fieldId === selectedFieldId)
    ) 

    return defualtPrice?.fieldPrice ?? 0;
}


export function getMaxAvailableHours(
  reservations: FieldReservation[],
  startTime: Date,
  workingHoursEnd: Date
): number {
    let count = 1;
    let current = new Date(startTime);

    const endHour = new Date(workingHoursEnd);
    endHour.setHours(endHour.getHours() + 1);
    console.log(endHour)
    const resEndTime = endHour.getTime();
  
    while (true) {
        current.setHours(current.getHours() + 1);
    
        if (current.getTime() >= new Date(resEndTime).getTime()) {
            break;
        }
    
        const isTaken = reservations.some(res => {
            const resStart = new Date(res.reservationStartTime).getTime();
            const resEnd = new Date(res.reservationEndTime).getTime();
            const check = current.getTime();
            return check >= resStart && check <= resEnd;
        });
    
        if (isTaken) break;
    
        count++;
    }
  
    return count;
}

export function isSameDate(d1: Date | string, d2: Date | string): boolean {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}


export function getWorkingHoursForDay(
    workingHours: WorkingHours[],
    workingHoursStart: string,
    workingHoursEnd: string,
    day: Date,
    index: number,
    selectedFieldId?: string
    ): number[] {

    const startHour = parseInt(workingHoursStart.split(':')[0])
    const endHour = parseInt(workingHoursEnd.split(':')[0])

    const specificDateEntry =
        workingHours.find(wh =>
        wh.date &&
        isSameDate(new Date(wh.date), new Date(day)) &&
        wh.fieldId === selectedFieldId
        ) ??
        
        workingHours.find(wh =>
        wh.date &&
        isSameDate(new Date(wh.date), new Date(day)) &&
        wh.fieldId === null
        );       
    
    if (specificDateEntry) {
        return specificDateEntry.isClosed
        ? []
        : getDayWorkingHours(specificDateEntry.startTime, specificDateEntry.endTime);
    }

    const dayOfWeekEntry =
        
        workingHours.find(wh =>
        wh.dayOfWeek === index &&
        wh.fieldId === selectedFieldId
        ) ??

        workingHours.find(wh =>
        wh.dayOfWeek === index &&
        wh.fieldId === null
        );
    
    if (dayOfWeekEntry) {
        return dayOfWeekEntry.isClosed
        ? []
        : getDayWorkingHours(dayOfWeekEntry.startTime, dayOfWeekEntry.endTime);
    }

    return Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
}
