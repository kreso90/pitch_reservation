import { useState, useEffect } from 'react'
import { format } from 'date-fns/format';
import { addDays, startOfWeek } from 'date-fns';
import { Facility, FacilityFields, FieldReservation } from '@prisma/client';
import { combineDateAndTime, formatToISODateTime, formatDate } from '@/utils/formatUtils';

type FacilityWithFields = Facility & {
    facilityFields: (FacilityFields & {
        fieldReservation: FieldReservation[];
    })[];
};
  
export const useCalendar = () => {
    const [ days, setDays ] = useState<string[]>([]);
    const [ facilityData, setFacilityData ] = useState<FacilityWithFields | null>(null);
    const [ weekOffset, setWeekOffset ] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ isPopupOpen, setIsPopupOpen ] = useState(false);
    const [ isCancelPopupOpen, setIsCancelPopupOpen ] = useState(false);
    const [ reservationTime, setReservationTime ] = useState<FieldReservation | null>(null);
    const [ getMaxHours, setMaxHours ] = useState<number>(1)
    const [ reservationId, setReservationId ] = useState<string>('')
    const [ formMsg, setFormMsg ] = useState<string | null>(null)
    const [ selectedFieldId, setSelectedFieldId ] = useState<string>('');
    const [ daysNavigation, setDaysNavigation ] = useState<{
        firstWeekDay: string;
        lastWeekDay: string;
        month: string
        }>({
        firstWeekDay: '',
        lastWeekDay: '',
        month: ''
    });
      

    const getFacilityData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/facility');

            if (!res.ok) {
                throw new Error(`Error status: ${res.status}`);
            }
    
            const data: FacilityWithFields = await res.json();
            setFacilityData(data);
            setSelectedFieldId(data.facilityFields[0].fieldId ?? '');
        } catch (error) {
            console.error('Error facility data:', error);
        } finally {
            setLoading(false)
        }
    };

    const refreshFacilityData = async () => {
        await getFacilityData();
    };
    
    const generateWeek = () => {
        const start = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset * 3);
        const newDays = Array.from({ length: 7 }).map((_, i) =>
            format(addDays(start, i), 'EEE do MMMM yyyy')
        );
        setDays(newDays);

        const first = format(addDays(start, 0), 'do');
        const last = format(addDays(start, newDays.length - 1), 'do');
        const month = format(addDays(start, newDays.length - 1), 'MMMM');

        setDaysNavigation({
            firstWeekDay: first,
            lastWeekDay: last,
            month: month
        });
    };

    const handleNextWeek = () => {
        setWeekOffset(prev => prev + 1);
    };
    
    const handlePrevWeek = () => {
        setWeekOffset(prev => (prev > 0 ? prev - 1 : 0));
    };

    const handleBoxClick = (
        userId: string,
        fieldId: string, 
        name: string, 
        reservationStart: Date, 
        reservationEnd: Date, 
        facilityEndWorkingHours?: Date, 
        reservations?: FieldReservation[]
    ) => {
        setReservationTime({ reservationStartTime: new Date(reservationStart), reservationEndTime: reservationEnd, reservationName: name, fieldReservationId: fieldId, reservationId: fieldId, userId: userId});
        setIsPopupOpen(true);
        setMaxHours(getMaxAvailableHours(reservations ?? [], new Date(reservationStart), combineDateAndTime(reservationStart, new Date(facilityEndWorkingHours ?? new Date()))));
    };

    const handleCancelButton = (
        reservationId: string
    ) => {
        setReservationId(reservationId);
        setIsCancelPopupOpen(true)
    }

    const isSlotReserved = (reservations: FieldReservation[], dateToCheck: Date) => {
        return reservations.some(res => {
            const start = new Date(res.reservationStartTime).getTime();
            const end = new Date(res.reservationEndTime).getTime();
            const check = dateToCheck.getTime();

            return check >= start && check < end;
        });
    };
    
    const getReservationInfo = (
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
      
      

    const getHourStreakPosition = (
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
      

    function getMaxAvailableHours(
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

    useEffect(() => {
        getFacilityData()
    }, [])

    useEffect(() => {
        generateWeek();
    }, [weekOffset]);

    return {
        days,
        loading,
        facilityData,
        handleNextWeek,
        handlePrevWeek,
        isPopupOpen,
        setIsPopupOpen,
        isCancelPopupOpen,
        setIsCancelPopupOpen,
        handleCancelButton,
        reservationTime,
        reservationId,
        handleBoxClick,
        isSlotReserved,
        getHourStreakPosition,
        getMaxAvailableHours,
        refreshFacilityData,
        getReservationInfo,
        getMaxHours,
        setFormMsg,
        formMsg,
        setSelectedFieldId,
        selectedFieldId,
        daysNavigation
    };
};
