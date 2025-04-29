import { deleteReservation } from '@/app/actions/actions';
import useReservations from '@/hooks/useReservations';
import { FacilityWithFields } from '@/types/facilityData';
import React, { useActionState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ReservationListProps = {
    facilityData: FacilityWithFields | null;
    initialFieldId: string | null;
    refreshFacilityData: () => Promise<void>;
    userId: string,
    userName: string
};

export default function ReservationsList({ facilityData, refreshFacilityData }: ReservationListProps) {
    const { searchName, setSearchName, setSearchDate, searchDate, searchField, setSearchField, searchOldNew, setSearchOldNew, handleCancelButton, isCancelPopupOpen, setIsCancelPopupOpen, reservationId, setReservationId } = useReservations()

     const [deleteState, formDeleteAction, isDeletePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await deleteReservation(prevState, formData);
        
            await refreshFacilityData();
            return result;
        },
        null
    )

    return (
        <div>
            <div className='search-nav'>

                <div className="form__field">
                    <label htmlFor="name">Search by name</label>
                    <input type="text" id="name" onChange={(e) => setSearchName(e.target.value)} value={searchName}/>
                </div>

                <div className="form__field">
                    <label htmlFor="date_from">Search by date</label>
                    <DatePicker id="date_from" dateFormat="dd.MM.yyyy." selected={searchDate} onChange={(date) => setSearchDate(date)}  isClearable />
                </div>

                <div className="form__field">
                    <label htmlFor="field_select">Select field</label>
                    <select
                        id="field_select"
                        name="field_select"
                        value={searchField}
                        className="input"
                        onChange={(e) => {
                            setSearchField(e.target.value); 
                        }}
                    >
                        <option value="all">All fields</option>
                    {facilityData?.facilityFields.map((field) => (
                        <option key={field.fieldId} value={field.fieldId}>
                            {field.fieldName}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="form__field">
                    <label htmlFor="search_old_new">Show reservations</label>
                    <select
                        id="search_old_new"
                        name="search_old_new"
                        value={searchOldNew}
                        className="input"
                        onChange={(e) => setSearchOldNew(e.target.value)}
                    >
                        <option value="upcoming">Upcoming</option>
                        <option value="previous">Previous</option>
                    </select>
                </div>

            </div>
            {facilityData?.facilityFields
            .filter((field) => {
                if (searchField === "all") return true;
                return searchField === field.fieldId;
            })
            .map((field) => {
                const filteredReservations = field.fieldReservation
                .filter((res) => {
                    const resDate = new Date(res.reservationStartTime);
                    const now = new Date();

                    if (searchOldNew === "upcoming") return resDate >= now;
                    if (searchOldNew === "previous") return resDate < now;

                    return true;
                })
                .filter((res) => {
                    const name = res.reservationName.toLowerCase();
                    const term = searchName.toLowerCase();

                    if (term === "") return true;
                    if (term.length === 1) return name.startsWith(term);
                    return name.includes(term);
                })
                .filter((res) => {
                    const reservationDate = new Date(res.reservationStartTime);

                    if (!searchDate) return true;

                    return (
                    searchDate.getDate() === reservationDate.getDate() &&
                    searchDate.getMonth() === reservationDate.getMonth() &&
                    searchDate.getFullYear() === reservationDate.getFullYear()
                    );
                })
                .sort(
                    (a, b) =>
                    new Date(a.reservationStartTime).getTime() -
                    new Date(b.reservationStartTime).getTime()
                );

                return (
                <div key={field.fieldId}>
                    <h2 className="m-bottom-30">{field.fieldName}</h2>
                    <ul className="m-bottom-30">
                    {filteredReservations.length > 0 ? (
                        filteredReservations.map((res) => {
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
                        );
                        })
                    ) : (
                        <li className="no-events text-muted italic">
                        No {searchOldNew} reservations
                        </li>
                    )}
                    </ul>
                </div>
                );
            })}


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
