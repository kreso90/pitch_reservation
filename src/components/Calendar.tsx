"use client"
import { createReservation, deleteReservation } from '@/app/actions/actions';
import { useCalendar } from '@/hooks/useCalendar'
import { FacilityWithFields } from '@/types/facilityData';
import { getHourStreakPosition, getPriceForHour, getReservationInfo, getWorkingHoursForDay, isPrevDate, isSlotReserved } from '@/utils/calendarUtils';
import { createDateFromStringAndNumber, formatDate, formatStringToDate, formatToISODateTime } from '@/utils/formatUtils';
import React, { useActionState, useEffect } from 'react'
import { TbCalendarMonth, TbArrowRight, TbArrowLeft } from "react-icons/tb";

type CalendarProps = {
    facilityData: FacilityWithFields | null;
    initialFieldId: string | null;
    refreshFacilityData: () => Promise<void>;
    userId: string,
    userName: string
};

export default function Calendar({ facilityData, initialFieldId, refreshFacilityData, userId, userName }: CalendarProps) {

    const { days, daysNavigation, selectedFieldId, setSelectedFieldId, getMaxHours, setFormMsg, formMsg, handleNextWeek, handleCancelButton, handlePrevWeek, isPopupOpen, reservationTime, reservationId, setIsPopupOpen, handleBoxClick } = useCalendar();

    useEffect(() => {
        setSelectedFieldId(initialFieldId ?? '')
    }, [initialFieldId])
    
    const [state, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await createReservation(prevState, formData);
        
            setFormMsg(result ?? ''); 
            return result;
        },
        null
    )

    const [deleteState, formDeleteAction, isDeletePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await deleteReservation(prevState, formData);
        
            setFormMsg(result ?? ''); 
            return result;
        },
        null
    )
  
    return (
        <div className="calendar">

            <div className="calendar__header">
                
                <select
                    name="field_select"
                    value={selectedFieldId}
                    onChange={(e) => {
                        setSelectedFieldId(e.target.value); 
                        setIsPopupOpen(''); 
                    }}
                >
        
                {facilityData?.facilityFields.map((field) => (
                    <option key={field.fieldId} value={field.fieldId}>
                    {field.fieldName}
                    </option>
                ))}
                </select>

                <div className="days-nav">
                    <button className="round" onClick={handlePrevWeek}><TbArrowLeft size={14} color='#fff'/></button>
                    <div className="days-nav__wrapper">
                        <TbCalendarMonth size={16}/>
                        <span className="m-left-10">{daysNavigation.firstWeekDay} - {daysNavigation.lastWeekDay} {daysNavigation.month}</span>
                    </div>
                    <button className="round" onClick={handleNextWeek}><TbArrowRight size={14} color='#fff'/></button>
                </div>

            </div>
       
           
            {facilityData?.facilityFields
                .filter((field) => field.fieldId == selectedFieldId)
                .map((field) => {
                    return (
                    <div key={field.fieldId} className="calendar__grid">
                        {days.map((day, index) => {
                            
                        const hours = getWorkingHoursForDay(
                            facilityData.workingHours,
                            facilityData.workingHoursStart,
                            facilityData.workingHoursEnd,
                            new Date(createDateFromStringAndNumber(day, 0)),
                            index,
                            selectedFieldId
                        );
                  
                        return (
                            <div key={index} className="calendar__column">
                            <p className="calendar__day">{formatStringToDate(day)}</p>

                            {hours.length > 0 ? (hours.map((hour) => {
                                const fieldIndex = facilityData?.facilityFields.findIndex(
                                (field) => field.fieldId === selectedFieldId
                                );
                                const reservations = facilityData?.facilityFields[fieldIndex]?.fieldReservation ?? [];
                                const slotDate = new Date(createDateFromStringAndNumber(day, hour));
                                const isReserved = isSlotReserved(reservations, slotDate);
                                const streakStatus = getHourStreakPosition(reservations, slotDate);
                                const reservationInfo = getReservationInfo(reservations, slotDate, userId ?? '');
                                const isPrevDates = isPrevDate(slotDate);
                                const pricingEntry = getPriceForHour(facilityData.hourlyPricing, index, hour, selectedFieldId)

                                return (
                                <div
                                    key={hour}
                                    className={`calendar__box ${isReserved || isPrevDates ? 'reserved' : ''} ${reservationInfo?.isReservedByUser ? `reserved-by-user` : ''} ${streakStatus ? `calendar__box--${streakStatus}` : ''}`}
                                    onClick={
                                    !isReserved && !isPrevDates
                                        ? () =>
                                            handleBoxClick(
                                                userId ?? '',
                                                field.fieldId,
                                                field.fieldName,
                                                createDateFromStringAndNumber(day, hour),
                                                new Date(day),
                                                createDateFromStringAndNumber(day, hours[hours.length - 1]),
                                                facilityData.facilityFields[fieldIndex].fieldReservation
                                            ) 
                                        : () => {}
                                    }
                                >
                                    <div className="calendar__box__top place-space-between m-bottom-20">
                                    <span>{hour}:00</span>
                                    {reservationInfo?.isReservedByUser &&
                                    new Date(createDateFromStringAndNumber(day, hour)) > new Date() ? (
                                        <span onClick={() => handleCancelButton(reservationInfo?.reservationId ?? '')}>
                                        Cancel
                                        </span>
                                    ) : (
                                        <span></span>
                                    )}
                                    </div>

                                    <div className="calendar__box__bottom place-space-between">
                                        <span className="light-grey">
                                            {reservationInfo?.isReservedByUser ? 'Reserved by you' : pricingEntry + '€'}
                                        </span>
                                    </div>
                                </div>
                                );
                            })) : 
                            <div className="calendar__box">
                                <div className="calendar__box__top place-space-between m-bottom-20">
                                    <span>Non-working day</span>
                                    <span></span>
                                </div>
                            </div>
                            }
                            </div>
                        );
                        })}
                    </div>
                    );
                })}

            
            {isPopupOpen == "reservation" && (
                <div className="popup">
                    <div className="popup__content">
                        {formMsg == '' ? 
                        <form action={formAction}>
                            <p className="m-bottom-20">Do you want to reserve {reservationTime?.reservationName} on {formatDate(reservationTime?.reservationStartTime)}?</p>                    
                            <input type="hidden" name='field_reservation_id' value={reservationTime?.fieldReservationId}/>
                            <input type="hidden" name='user_id' value={reservationTime?.userId}/>
                            <input type="hidden" name="reservation_name" value={userName ?? 'Unknown'} />
                            <input type="hidden" name="reservation_start" value={formatToISODateTime(formatDate(reservationTime?.reservationStartTime))} />
                            <p className="m-bottom-5">Select number of hours</p>
                            <select name="reservation_end" className="m-bottom-30 input">
                                {Array.from({ length: getMaxHours }, (_, i) => {
                                    const hours = i + 1;
                                    return (
                                    <option key={hours} value={formatToISODateTime(formatDate(reservationTime?.reservationStartTime), hours)}>
                                        {hours} hour{hours > 1 ? 's' : ''}
                                    </option>
                                    );
                                })}
                            </select>
                            <div className="two-col-grid">
                                <button type="button" onClick={() => setIsPopupOpen('')}>Cancel</button>
                                <button type='submit' disabled={isPending}>Confirm</button>
                            </div>
                        </form>
                        :
                        <div>
                            <p>{formMsg}</p>
                            <button onClick={() => {refreshFacilityData()}}>Ok</button>
                        </div> 
                       }
                     
                    </div>
                </div>
            )}

            {isPopupOpen == "cancel" && (
                <div className="popup">
                    <div className="popup__content">
                    {formMsg == '' ?   
                        <form action={formDeleteAction}>
                            <p className="m-bottom-20">Do you realy want to cancle reservation?</p>   
                            <input type="hidden" name="reservation_id" value={reservationId} />

                            <div className="two-col-grid">
                                <button type="button" onClick={() => setIsPopupOpen('')}>Cancel</button>
                                <button type='submit' disabled={isPending}>Confirm</button>
                            </div>
                        </form>         
                        : 
                        <div>
                            <p className="m-bottom-20">{formMsg}</p>
                            <button onClick={() => {refreshFacilityData()}}>Ok</button>
                        </div>}
                    </div>
                </div>
            )}
        </div>
    )
}
