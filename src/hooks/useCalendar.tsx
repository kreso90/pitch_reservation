import { useState, useEffect } from 'react'
import { format } from 'date-fns/format';
import { addDays, startOfWeek } from 'date-fns';
import { FieldReservation } from '@prisma/client';
import { combineDateAndTime } from '@/utils/formatUtils';
import { getMaxAvailableHours } from '@/utils/calendarUtils';
  
export const useCalendar = () => {
    const [ days, setDays ] = useState<string[]>([]);
    const [ weekOffset, setWeekOffset ] = useState(0);
    const [ selectedFieldId, setSelectedFieldId ] = useState<string>('');
    const [ isPopupOpen, setIsPopupOpen ] = useState<'cancel' | 'reservation' | ''>('');
    const [ reservationTime, setReservationTime ] = useState<FieldReservation | null>(null);
    const [ getMaxHours, setMaxHours ] = useState<number>(1)
    const [ reservationId, setReservationId ] = useState<string>('')
    const [ formMsg, setFormMsg ] = useState<string>('')
    const [ visibleDays, setVisibleDays ] = useState(7);

    const [ daysNavigation, setDaysNavigation ] = useState<{
        firstWeekDay: string;
        lastWeekDay: string;
        month: string
        }>({
        firstWeekDay: '',
        lastWeekDay: '',
        month: ''
    });
      
    
    const generateWeek = () => {
        const start = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset * visibleDays);
        const newDays = Array.from({ length: visibleDays }).map((_, i) =>
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
        setIsPopupOpen("reservation");
        setMaxHours(getMaxAvailableHours(reservations ?? [], new Date(reservationStart), combineDateAndTime(reservationStart, new Date(facilityEndWorkingHours ?? new Date()))));
    };

    const handleCancelButton = (
        reservationId: string
    ) => {
        setReservationId(reservationId);
        setIsPopupOpen("cancel");
    }

    useEffect(() => {
        const updateVisibleDays = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setVisibleDays(2);
            } else if (width < 1024) { 
                setVisibleDays(4);
            } else {
                setVisibleDays(7);
            }
        };
    
        updateVisibleDays();
        window.addEventListener('resize', updateVisibleDays);
        return () => window.removeEventListener('resize', updateVisibleDays);
    }, []);


    useEffect(() => {
        generateWeek();
    }, [weekOffset]);

    return {
        days,
        handleNextWeek,
        handlePrevWeek,
        isPopupOpen,
        setIsPopupOpen,
        handleCancelButton,
        reservationTime,
        reservationId,
        handleBoxClick,
        getMaxAvailableHours,
        getMaxHours,
        setFormMsg,
        formMsg,
        daysNavigation,
        setSelectedFieldId,
        selectedFieldId
    };
};
