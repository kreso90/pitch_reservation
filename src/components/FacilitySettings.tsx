import { createHoursAction, deleteWorkingHours, editWrokingHours } from '@/app/actions/actions';
import useFacilitySettings from '@/hooks/useFacilitySettings';
import { FacilityWithFields } from '@/types/facilityData';
import { allDaysOfWeek, formatDate, formatDay, parseTimeStringToDate } from '@/utils/formatUtils';
import React, { useActionState } from 'react'
import DatePicker from 'react-datepicker';
import { TbClockEdit, TbTrash } from 'react-icons/tb';

type FacilitySettingsProps = {
    facilityData: FacilityWithFields | null;
    refreshFacilityData: () => void;
};

export default function FacilitySettings({facilityData, refreshFacilityData}: FacilitySettingsProps) {

    const { handleEditWorkingHours, handleCreateWorkingHours, workingHours, isPopupOpen, setIsPopupOpen, setStartTime, startTime, endTime, setEndTime, formMsg, setFormMsg, selectedField, setSelectedField, date, setDate, ruleType, handleRadioChange, workingHoursId, handleDeleteButton } = useFacilitySettings();

    const [state, formEditAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await editWrokingHours(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    )

    const [createState, formCreateAction, isCreatePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await createHoursAction(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    )

    const [deleteState, formDeleteAction, isDeletePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await deleteWorkingHours(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    )

    const filteredWorkingHours =
    selectedField === ""
    ? facilityData?.workingHours.filter((wh) => wh.fieldId === null)
    : facilityData?.workingHours.filter(
        (wh) => wh.fieldId === selectedField
      );


    return (
    <div className="row">
        <div className="col md-6 m-bottom-20">
            <h3 className="m-bottom-20">Default working day hours</h3>
            <ul>
                {facilityData?.workingHours
                .filter((res) => res.fieldId === null)
                .sort((a, b) => (a.dayOfWeek ?? 0) - (b.dayOfWeek ?? 0))
                .map((dayHours) => (
                    <li key={dayHours.id} className="m-bottom-10 b-bottom-1-white">
                        <div className="row">
                        <div className="col md-3 m-bottom-5">
                            {dayHours.dayOfWeek != null ? formatDay(dayHours.dayOfWeek ?? 0) 
                                :   dayHours.date != null ? new Date(dayHours.date).toLocaleDateString("hr-HR", {
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric",
                                    }) : "No day or" }
                            </div>
                            <div className="col md-4 m-bottom-5">{dayHours.startTime} - {dayHours.endTime}</div>
                            <div className="col md-3 m-bottom-5">{dayHours.isClosed ? "Closed" : "Open"}</div>
                            <div className="col md-2 m-bottom-5 white-space-no">
                            <span className="c-pointer" onClick =
                                {() => {
                                    handleEditWorkingHours(
                                        dayHours.id,
                                        facilityData.facilityId,
                                        null,
                                        undefined,
                                        dayHours.dayOfWeek ?? undefined,
                                        dayHours.startTime,
                                        dayHours.endTime,
                                        dayHours.isClosed
                                    )
                                    setStartTime(
                                        dayHours.startTime && dayHours.startTime.trim() !== ""
                                        ? parseTimeStringToDate(dayHours.startTime)
                                        : null
                                    );
                                    setEndTime(
                                        dayHours.endTime && dayHours.endTime.trim() !== ""
                                        ? parseTimeStringToDate(dayHours.endTime)
                                        : null
                                    );
                                    }
                                }>
                                <TbClockEdit size={22}/></span>
                                <span className="m-left-10 c-pointer" onClick={() => handleDeleteButton(dayHours.id)}><TbTrash size={22} color="#aa1e3c"/></span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        
        {facilityData?.facilityFields.map((field) => (
        <div key={field.fieldId} className="col md-6 m-bottom-20">
          
            <h3 className="m-bottom-20">Working hours for {field.fieldName}</h3>
            <ul>
            {facilityData?.workingHours
            .filter((res) => field.fieldId === res.fieldId)
            .sort((a, b) => (a.dayOfWeek ?? 0) - (b.dayOfWeek ?? 0))
            .map((dayHours) => (
                <li key={dayHours.id} className="m-bottom-10 b-bottom-1-white">
                    <div className="row">
                        <div className="col md-3 m-bottom-5">
                            {dayHours.dayOfWeek != null ? formatDay(dayHours.dayOfWeek ?? 0) 
                            :   dayHours.date != null ? new Date(dayHours.date).toLocaleDateString("hr-HR", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                }) : "No day or" }
                        </div>
                        <div className="col md-4 m-bottom-5">{dayHours.startTime} - {dayHours.endTime}</div>
                        <div className="col md-3 m-bottom-5">{dayHours.isClosed ? "Closed" : "Open"}</div>
                        <div className="col md-2 m-bottom-5 white-space-no">
                            <span className="c-pointer" onClick =
                            {() => {
                                handleEditWorkingHours(
                                    dayHours.id,
                                    field.facilityFieldId,
                                    field.fieldId,
                                    undefined,
                                    dayHours.dayOfWeek ?? undefined,
                                    dayHours.startTime,
                                    dayHours.endTime,
                                    dayHours.isClosed
                                )
                                setStartTime(
                                    dayHours.startTime && dayHours.startTime.trim() !== ""
                                      ? parseTimeStringToDate(dayHours.startTime)
                                      : null
                                  );
                                  setEndTime(
                                    dayHours.endTime && dayHours.endTime.trim() !== ""
                                      ? parseTimeStringToDate(dayHours.endTime)
                                      : null
                                  );
                                }
                            }>
                                <TbClockEdit size={22}/></span>
                            <span className="m-left-10 c-pointer" onClick={() => handleDeleteButton(dayHours.id)}><TbTrash size={22} color="#aa1e3c"/></span>
                            
                        </div>
                    </div>
                </li>
            ))}
            </ul>
        </div>
        ))}

        {isPopupOpen == "update" && (
        <div className="popup">
            <div className="popup__content">
               
                {formMsg == '' ?
                    <form action={formEditAction}>
                    <p className="m-bottom-30">Edit working hours for <span className="semi-bold">{formatDay(workingHours?.dayOfWeek ?? 0, true)}</span></p>                    
                    <input type="hidden" name='id' value={workingHours?.id}/>

                    <div className='three-md-col-grid m-bottom-30'>

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

                        <div className='form__field'>
                            <label htmlFor="end_time">End time</label>
                            <DatePicker
                                id="end_time"
                                name="end_time"
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

                        <div className='form__field'>
                            <label htmlFor="is_closed">Open/Closed</label>
                            <select className="input" id="is_closed" name="is_closed">
                                <option value="0">Open</option>
                                <option value="1">Closed</option>
                            </select>
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
                </div>
                }
          
            </div>
        </div>
    )}

    {isPopupOpen == "create" && (
        <div className="popup">
            <div className="popup__content">
               
                {formMsg == '' ?
                    <form action={formCreateAction}>
                    <input type="hidden" name='facility_id' value={facilityData?.facilityId} />
                    <p className="m-bottom-30">Add new wroking hours rule</p>                    

                    <p className="m-bottom-5">Choose rule type</p>
                    <div className="radio m-bottom-20">

                        <div className="radio__field">
                            <input type="radio" value="day" id="radio_day" name="rule_type" defaultChecked onChange={handleRadioChange}/>
                            <label htmlFor="radio_day">Day</label>
                        </div>

                        <div className="radio__field">
                            <input type="radio" value="date" id="radio_date" name="rule_type" onChange={handleRadioChange}/>
                            <label htmlFor="radio_date">Date</label>
                        </div>

                    </div>

                    <div className='two-md-col-grid m-bottom-10'>
                        <div className='form__field'>
                            <label htmlFor="field_id">Field</label>
                            <select name="field_id" id="field_id" className="input" value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                                <option value="">All fields</option>
                                {facilityData?.facilityFields.map((fields) => (
                                    <option key={fields.fieldId} value={fields.fieldId}>{fields.fieldName}</option>
                                ))}
                            </select>
                        </div>

                        {ruleType != "date" ? <div className='form__field'>
                            <label htmlFor="week_day">Day of week</label>
                            {filteredWorkingHours != null && (
                            <select id="week_day" name="week_day" className="input">
                                <option value="">Choose day</option>
                                {allDaysOfWeek
                                .filter(
                                    (day) =>
                                    !filteredWorkingHours.some(
                                        (wh) => wh.dayOfWeek === day.value
                                    )
                                )
                                .map((day) => (
                                    <option key={day.value} value={day.value}>
                                    {day.label}
                                    </option>
                                ))}
                            </select>
                            )}
                        </div>
                            :
                        <div className='form__field'>
                            <label htmlFor="date">Date</label>
                            <DatePicker
                                id="date"
                                name="date"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                isClearable
                            />
                        </div>}
                    </div>

                    <div className='three-md-col-grid m-bottom-30'>
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

                        <div className='form__field'>
                            <label htmlFor="end_time">End time</label>
                            <DatePicker
                                id="end_time"
                                name="end_time"
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

                        <div className='form__field'>
                            <label htmlFor="is_closed">Open/Closed</label>
                            <select className="input" id="is_closed" name="is_closed">
                                <option value="0">Open</option>
                                <option value="1">Closed</option>
                            </select>
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
                </div>
                }
          
            </div>
        </div>)}

        <div className="col">
            <button onClick={() => handleCreateWorkingHours()}>Add working hours</button>
        </div>

        {isPopupOpen == "delete" && (
            <div className="popup">
                <div className="popup__content">
                {formMsg == '' ?
                                       
                    <form action={formDeleteAction}>
                        <p className="m-bottom-20">Do you realy want to delete this working hours?</p>
                        <input type="hidden" name="id" value={workingHoursId} />
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
        )}
    </div>
  );
}