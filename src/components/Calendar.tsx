"use client"
import { createReservation, deleteReservation } from '@/app/actions/actions';
import { useCalendar } from '@/hooks/useCalendar'
import { createFullDateFromLabel, formatDate, formatStringToDate, formatToISODateTime } from '@/utils/formatUtils';
import { useSession } from 'next-auth/react';
import React, { useActionState } from 'react'
import { FaArrowRight, FaArrowLeft, FaCalendar } from "react-icons/fa";

export default function Calendar() {

    const {days, daysNavigation, selectedFieldId, setSelectedFieldId, getMaxHours, setFormMsg, formMsg, handleNextWeek, handleCancelButton, setIsCancelPopupOpen, isCancelPopupOpen, getReservationInfo, refreshFacilityData, getHourStreakPosition, handlePrevWeek, isSlotReserved, facilityData, isPopupOpen, reservationTime, reservationId, setIsPopupOpen, handleBoxClick} = useCalendar();
    const { data: session } = useSession()
    const startHour = new Date(facilityData?.workingHoursStart ?? '').getHours();
    const endHour = new Date(facilityData?.workingHoursEnd ?? '').getHours();   
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
    
    const [state, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await createReservation(prevState, formData);
        
            if (result) {
                await refreshFacilityData();
            }
            
            setFormMsg(result ?? null); 
            return result;
        },
        null
    )

    const [deleteState, formDeleteAction, isDeletePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await deleteReservation(prevState, formData);
        
            if (result === "success") {
                await refreshFacilityData();
            }
        
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
                        setIsPopupOpen(false); 
                        setIsCancelPopupOpen(false);
                    }}
                >
        
                {facilityData?.facilityFields.map((field) => (
                    <option key={field.fieldId} value={field.fieldId}>
                    {field.fieldName}
                    </option>
                ))}
                </select>

                <div className="days-nav">
                    <button className="round" onClick={handlePrevWeek}><FaArrowLeft size={12} color='#fff'/></button>
                    <div className="days-nav__wrapper">
                        <FaCalendar size={14}/>
                        <span className="m-left-10">{daysNavigation.firstWeekDay} - {daysNavigation.lastWeekDay} {daysNavigation.month}</span>
                    </div>
                    <button className="round" onClick={handleNextWeek}><FaArrowRight size={12} color='#fff'/></button>
                </div>

            </div>
       
           
            {facilityData?.facilityFields
            .filter((field) => field.fieldId == selectedFieldId)
            .map((field) => (
                
                <div key={field.fieldId} className="calendar__grid">
                    
                    {days.map((day, index) => (
                        
                        <div key={index} className="calendar__column">
                            <p className="calendar__day">{formatStringToDate(day)}</p>
                          
                            {hours.map((hour) => {
                                const fieldIndex = facilityData?.facilityFields.findIndex(
                                    (field) => field.fieldId === selectedFieldId
                                );
                                const reservations = facilityData?.facilityFields[fieldIndex]?.fieldReservation ?? [];
                                const slotDate = new Date(createFullDateFromLabel(day, hour));
                                const isReserved = isSlotReserved(reservations, slotDate);
                                const streakStatus = getHourStreakPosition(reservations, slotDate);
                                const reservationInfo = getReservationInfo(reservations, slotDate, session?.user.id ?? '');

                                return (
                                    <div key={hour} className={`calendar__box ${isReserved ? 'reserved' : ''} ${reservationInfo?.isReservedByUser ? `reserved-by-user` : ''} ${streakStatus ? `calendar__box--${streakStatus}` : ''}`}
                                        onClick={!isReserved ? () =>
                                            handleBoxClick(
                                            session?.user?.id ?? '',
                                            field.fieldId,
                                            field.fieldName,
                                            createFullDateFromLabel(day, hour),
                                            new Date(day),
                                            facilityData.workingHoursEnd,
                                            facilityData.facilityFields[fieldIndex].fieldReservation
                                            ) : () => {}
                                        }
                                        >

                                        <div className="calendar__box__top place-space-between m-bottom-20">
                                            <span>{hour}:00</span>
                                            {reservationInfo?.isReservedByUser ? <span onClick={() => handleCancelButton(reservationInfo?.reservationId ?? '')}>Cancel</span> : <span></span>}
                                        </div>

                                        <div className="calendar__box__bottom place-space-between">
                                            <span className="light-grey">{reservationInfo?.isReservedByUser ? 'Reserved by you' : '40.00 €'}</span>
                                        </div>
                                    </div>
                                    );
                                })}
                            
                        </div>
                    ))}
                
                </div> 
            ))}
            
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup__content">
                        {formMsg == null ? 
                        <form action={formAction}>
                            <p>Do you want to reserve {reservationTime?.reservationName} on {formatDate(reservationTime?.reservationStartTime)}?</p>                    
                            <input type="hidden" name='field_reservation_id' value={reservationTime?.fieldReservationId}/>
                            <input type="hidden" name='user_id' value={reservationTime?.userId}/>
                            <input type="hidden" name="reservation_name" value={session?.user?.name ?? 'Unknown'} />
                            <input type="hidden" name="reservation_start" value={formatToISODateTime(formatDate(reservationTime?.reservationStartTime))} />
                            <p>Select number of hours {formatDate(reservationTime?.reservationStartTime)}</p>
                            <select name="reservation_end">
                                {Array.from({ length: getMaxHours }, (_, i) => {
                                    const hours = i + 1;
                                    return (
                                    <option key={hours} value={formatToISODateTime(formatDate(reservationTime?.reservationStartTime), hours)}>
                                        {hours} hour{hours > 1 ? 's' : ''}
                                    </option>
                                    );
                                })}
                            </select>
                            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
                            <button type='submit' disabled={isPending}>Confirm</button>
                        </form>
                        :
                        <div>
                            <p>{formMsg}</p>
                            <button onClick={() => { setIsPopupOpen(false); setFormMsg(null); }}>Ok</button>
                        </div> 
                       }
                     
                    </div>
                </div>
            )}

            {isCancelPopupOpen && (
                <div className="popup">
                    <div className="popup__content">
                        <p>Do you realy want to cancle reservation?</p>                    
                        <form action={formDeleteAction} onSubmit={() => setIsCancelPopupOpen(false)}>
                            <input type="hidden" name="reservation_id" value={reservationId} />
                            <button type='submit' disabled={isDeletePending}>Confirm</button>
                        </form>
                        <button onClick={() => setIsCancelPopupOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}
