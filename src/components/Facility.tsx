import { editFacility } from '@/app/actions/actions';
import useFacilitySettings, { popularSports } from '@/hooks/useFacilitySettings';
import { FacilityWithFields } from '@/types/facilityData';
import { parseTimeStringToDate } from '@/utils/formatUtils';
import React, { useActionState } from 'react'
import DatePicker from 'react-datepicker';
import { TbEdit } from 'react-icons/tb';

type FieldsProps = {
    facilityData: FacilityWithFields | null;
    refreshFacilityData: () => void;
    isAdmin: boolean
};

const Facility = ({facilityData, refreshFacilityData, isAdmin}: FieldsProps) => {
    const { deleteId, editData, setStartTime, startTime, endTime, setEndTime, isPopupOpen, setIsPopupOpen, formMsg, setFormMsg, facilityEditData, handleFieldChange, handleEditFacilityButton, handleCheckboxChange } = useFacilitySettings();

    const [state, formEditAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await editFacility(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    )
    
    return (
        <div className="m-bottom-40">

            <div className="flex">
                <h2 className="m-bottom-40 m-right-10">Facility info</h2>
                {isAdmin && (
                <TbEdit onClick={() => 
                {handleEditFacilityButton(
                    facilityData?.facilityName ?? '',
                    facilityData?.facilityDesc ?? '',
                    facilityData?.facilityAddress ?? '',
                    facilityData?.facilityEmail ?? '',
                    facilityData?.facilityTelephone ?? '',
                    facilityData?.workingHoursStart ?? '',
                    facilityData?.workingHoursEnd ?? '',
                    facilityData?.facilityFieldTypes ?? []
                )
                setStartTime(
                    facilityData && facilityData.workingHoursStart && facilityData.workingHoursStart.trim() !== ""
                    ? parseTimeStringToDate(facilityData.workingHoursStart)
                    : null
                );
                setEndTime(
                    facilityData && facilityData.workingHoursEnd && facilityData.workingHoursEnd.trim() !== ""
                    ? parseTimeStringToDate(facilityData.workingHoursEnd)
                    : null
                );
                }} size={32} className="icon-button"/>)}
            </div>

            <ul>
                <li className="m-bottom-5"><h3 className="m-bottom-10">{facilityData?.facilityName}</h3></li>
                <li className="m-bottom-5"><strong>Adrress: </strong>{facilityData?.facilityAddress}</li>
                <li className="m-bottom-5"><strong>Email: </strong>{facilityData?.facilityEmail}</li>
                <li className="m-bottom-5"><strong>Telephone: </strong>{facilityData?.facilityTelephone}</li>
                <li className="m-bottom-5"><strong>Sports: </strong>
                {facilityData?.facilityFieldTypes.map((type, index, arr) => (
                    <span key={type}>
                    {type}{index < arr.length - 1 ? ', ' : ''}
                    </span>
                ))}
                </li>
                <li className="m-bottom-5"><strong>Working hours: </strong>{facilityData?.workingHoursStart} - {facilityData?.workingHoursEnd}</li>
            </ul>

            {isPopupOpen == "update" && (
            <div className="popup__overlay">
                <div className="popup">
                    <div className="popup__content">
                    {formMsg == '' ?
                                            
                        <form action={formEditAction}>
                            <p className="m-bottom-30">Edit your facility</p>
                            <input type="hidden" name="id" value={facilityData?.facilityId} />

                            <div className="row">

                                <div className='col md-6'>
                                    <div className='form__field'>
                                        <label htmlFor="name">Name</label>
                                        <input type="text" name="name" id="name" value={facilityEditData.name} onChange={(e) => handleFieldChange(e, 'name', 'facilityData')}/>
                                    </div>
                                </div>

                                <div className='col md-6'>
                                    <div className='form__field'>
                                        <label htmlFor="address">Address</label>
                                        <input type="text" name="address" id="address" value={facilityEditData.address} onChange={(e) => handleFieldChange(e, 'address', 'facilityData')}/>
                                    </div>
                                </div>
                                
                                <div className='col md-6'>
                                    <div className='form__field'>
                                        <label htmlFor="email">Email</label>
                                        <input type="email" name="email" id="email" value={facilityEditData.email} onChange={(e) => handleFieldChange(e, 'email', 'facilityData')}/>
                                    </div>
                                </div>

                                <div className='col md-6'>
                                    <div className='form__field'>
                                        <label htmlFor="telephone">Telephone</label>
                                        <input type="text" name="telephone" id="telephone" value={facilityEditData.telephone} onChange={(e) => handleFieldChange(e, 'telephone', 'facilityData')}/>
                                    </div>
                                </div>

                                <div className='col md-6'>
                                    <div className='form__field'>
                                        <label htmlFor="start_time">Start time</label>
                                        <DatePicker
                                            name="start_time"
                                            id="start_time"
                                            selected={startTime}
                                            onChange={(date) => setStartTime(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={60}
                                            timeFormat="HH:mm"
                                            dateFormat="HH:mm"
                                            isClearable
                                        />
                                    </div>
                                </div>

                                <div className='col md-6'>
                                    <div className='form__field'>
                                        <label htmlFor="end_time">End time</label>
                                        <DatePicker
                                            name="end_time"
                                            id="end_time"
                                            selected={endTime}
                                            onChange={(date) => setEndTime(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={60}
                                            timeFormat="HH:mm"
                                            dateFormat="HH:mm"
                                            isClearable
                                        />
                                    </div>
                                </div>

                                <div className='col m-bottom-20'>
                                    <div className='form__field'>
                                        <label htmlFor="desc">Description</label>
                                        <textarea name="desc" id="desc" value={facilityEditData.desc} onChange={(e) => handleFieldChange(e, 'desc', 'facilityData')}>
                                            {facilityEditData.desc}
                                        </textarea>
                                    </div>
                                </div>

                                <div className='col'>
                                    <p className="m-bottom-20 semi-bold">Choose sports</p>
                                    <div className="two-col-grid m-bottom-30">
                                    {popularSports.map((sport) => (
                                        <div key={sport} className="checkbox__field">
                                                <input
                                                type="checkbox"
                                                name="field_types"
                                                value={sport}
                                                checked={facilityEditData.fieldTypes.includes(sport)}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label key={sport}>
                                                {sport}
                                            </label>
                                            
                                        </div>
                                    ))}
                                    </div>
                                </div>

                            </div>

                            <div className="two-col-grid">
                                <button type="button" onClick={() => setIsPopupOpen("")}>Cancel</button>
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
            </div>)}
        </div>
    )
}

export default Facility