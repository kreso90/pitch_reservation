import React, { useEffect, useState } from 'react'

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const useReservations = () => {
    const [ searchName, setSearchName ] = useState<string>('');
    const [ searchDate, setSearchDate ] = useState<Date | null>(null);
    const [ searchField, setSearchField ] = useState<string>('all');
    const [ searchOldNew, setSearchOldNew ] = useState<string>('upcoming');
    const [ isCancelPopupOpen, setIsCancelPopupOpen ] = useState(false);
    const [ reservationId, setReservationId ] = useState<string>('')

    const handleCancelButton = (
        reservationId: string
    ) => {
        setReservationId(reservationId);
        setIsCancelPopupOpen(true)
    }

    return { setSearchName, searchName, setSearchDate, searchDate, searchField, setSearchField, searchOldNew, setSearchOldNew, handleCancelButton, isCancelPopupOpen, setIsCancelPopupOpen, reservationId, setReservationId}
}

export default useReservations