import { deleteReservation } from '@/app/actions/actions';
import useReservations from '@/hooks/useReservations';
import { FacilityWithFields } from '@/types/facilityData';
import { useSession } from 'next-auth/react';
import React, { useActionState } from 'react'
import "react-datepicker/dist/react-datepicker.css";

type UserReservationListProps = {
    facilityData: FacilityWithFields | null;
    initialFieldId: string | null;
    refreshFacilityData: () => Promise<void>;
    userId: string,
    userName: string
};

export default function UserReservationList({ facilityData, refreshFacilityData }: UserReservationListProps) {
    const { handleCancelButton, isCancelPopupOpen, setIsCancelPopupOpen, reservationId } = useReservations()

     const [deleteState, formDeleteAction, isDeletePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await deleteReservation(prevState, formData);
        
            await refreshFacilityData();
            return result;
        },
        null
    )

    const { data: session } = useSession()
    
    return (
        <div>
            <h2 className="m-bottom-30">My reservations</h2>
            <ul>
                {session?.user.reservations.map((res) => {
                    const start = new Date(res.reservationStartTime);
                    const end = new Date(res.reservationEndTime);

                    return (
                    <li
                        key={res.reservationId}
                        className="m-bottom-10 p-bottom-10 b-bottom-1-white"
                        >
                        <div className="row">
                            <div className="col s-3">
                            <strong>{res.reservationName}</strong>
                            </div>
                            <div className="col s-3">
                            {start.toLocaleDateString("hr-HR", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                            })}
                            </div>
                            <div className="col s-3">
                            {start.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}{" "}
                            -{" "}
                            {end.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}
                            </div>
                            {end > new Date() && (
                            <div className="col s-3">
                                <span
                                className="red semi-bold c-pointer"
                                onClick={() =>
                                    handleCancelButton(res.reservationId ?? "")
                                }
                                >
                                Cancel
                                </span>
                            </div>
                            )}
                        </div>
                    </li>
                )})}

            </ul>

            {isCancelPopupOpen && (
            <div className="popup__overlay">
                <div className="popup">
                    <div className="popup__content">
                        <p className="m-bottom-20">Do you realy want to cancle reservation?</p>                    
                        <form action={formDeleteAction} onSubmit={() => setIsCancelPopupOpen(false)}>
                            <input type="hidden" name="reservation_id" value={reservationId} />
                            <div className="two-col-grid">
                                <button type="button" onClick={() => setIsCancelPopupOpen(false)}>Cancel</button>
                                <button type='submit' disabled={isDeletePending}>Confirm</button>
                            </div>
                        </form>
                
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}
