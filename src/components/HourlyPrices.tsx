import React, { useActionState } from 'react'
import useFacilitySettings from '@/hooks/useFacilitySettings';
import { FacilityWithFields } from '@/types/facilityData';
import { allDaysOfWeek, formatDay, formatPrice, parseTimeStringToDate } from '@/utils/formatUtils';
import { TbClockEdit, TbTrash } from 'react-icons/tb';
import { createHourlyPrices, deleteHourlyPrices, editHourlyPrices } from '@/app/actions/actions';
import DatePicker from 'react-datepicker';

type HourlyPricesProps = {
    facilityData: FacilityWithFields | null;
    refreshFacilityData: () => void;
    isAdmin: boolean
};

const HourlyPrices = ({facilityData, refreshFacilityData, isAdmin}: HourlyPricesProps) => {
    const { deleteId, editData, isPopupOpen, setIsPopupOpen, setStartTime, startTime, endTime, setEndTime, formMsg, setFormMsg, selectedField, setSelectedField, date, setDate, ruleType, handleRadioChange, handleCreateButton, handleEditButton, price, setPrice, handleChangePrice, handleDeleteButton } = useFacilitySettings();

    const [state, formEditAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await editHourlyPrices(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    )

    const [createState, formCreateAction, isCreatePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await createHourlyPrices(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    );

    const [deleteState, formDeleteAction, isDeletePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await deleteHourlyPrices(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    );            

    return (
    <div className="m-bottom-50">
        
        {!isAdmin && facilityData?.hourlyPricing && facilityData?.hourlyPricing.length > 0 ? (
            <h2 className="m-bottom-40">Hourly prices</h2>
        ) : null}
        
        <div className="m-bottom-20">
            
            {facilityData?.hourlyPricing && facilityData?.hourlyPricing.length > 0 ? (
                <h3 className="m-bottom-20">All fields</h3>
            ) : null}

            <ul>
                {facilityData?.hourlyPricing
                .filter((res) => res.fieldId === null)
                .sort((a, b) => (a.dayOfWeek ?? 0) - (b.dayOfWeek ?? 0))
                .map((hourlyPrices) => (
                    <li key={hourlyPrices.id} className="m-bottom-10 b-bottom-1-white">
                        <div className="row">
                        <div className="col md-3 m-bottom-5">
                            {hourlyPrices.dayOfWeek != null ? formatDay(hourlyPrices.dayOfWeek ?? 0) 
                                :   hourlyPrices.date != null ? new Date(hourlyPrices.date).toLocaleDateString("hr-HR", {
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric",
                                    }) : "All days" }
                            </div>
                            <div className="col md-4 m-bottom-5">{hourlyPrices.startTime} - {hourlyPrices.endTime}</div>
                            <div className="col md-3 m-bottom-5">{formatPrice(hourlyPrices.price)}</div>
                            {isAdmin && (
                            <div className="col md-2 m-bottom-5 white-space-no text-right">
                            <span className="c-pointer" onClick =
                                {() => {
                                    handleEditButton(
                                        hourlyPrices.id,
                                        facilityData.facilityId,
                                        undefined,
                                        undefined,
                                        undefined,
                                        hourlyPrices.date ?? undefined,
                                        hourlyPrices.dayOfWeek ?? undefined,
                                        hourlyPrices.startTime,
                                        hourlyPrices.endTime,
                                        false,
                                        hourlyPrices.price
                                    )
                                    setStartTime(
                                        hourlyPrices.startTime && hourlyPrices.startTime.trim() !== ""
                                        ? parseTimeStringToDate(hourlyPrices.startTime)
                                        : null
                                    );
                                    setEndTime(
                                        hourlyPrices.endTime && hourlyPrices.endTime.trim() !== ""
                                        ? parseTimeStringToDate(hourlyPrices.endTime)
                                        : null
                                    );
                                    setPrice(hourlyPrices.price)
                                    }
                                }>
                                <TbClockEdit size={22}/></span>
                                <span className="m-left-10 c-pointer" onClick={() => handleDeleteButton(hourlyPrices.id)}><TbTrash size={22} color="#aa1e3c"/></span>
                            </div>)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    {facilityData?.facilityFields.map((field) => (
        <div key={field.fieldId} className="m-bottom-20">
            
            {facilityData?.hourlyPricing.filter(res => field.fieldId === res.fieldId).length > 0 && (
                <h3 className="m-bottom-20">{field.fieldName}</h3>
            )}

            <ul>
            {facilityData?.hourlyPricing
            .filter((res) => field.fieldId === res.fieldId)
            .sort((a, b) => (a.dayOfWeek ?? 0) - (b.dayOfWeek ?? 0))
            .map((hourlyPrices) => (
                <li key={hourlyPrices.id} className="m-bottom-10 b-bottom-1-white">
                    <div className="row">
                        <div className="col md-3 m-bottom-5">
                            {hourlyPrices.dayOfWeek != null ? formatDay(hourlyPrices.dayOfWeek ?? 0) 
                            :   hourlyPrices.date != null ? new Date(hourlyPrices.date).toLocaleDateString("hr-HR", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                }) : "All days" }
                        </div>
                        <div className="col md-4 m-bottom-5">{hourlyPrices.startTime} - {hourlyPrices.endTime}</div>
                        <div className="col md-3 m-bottom-5">{formatPrice(hourlyPrices.price)}</div>
                        {isAdmin && (
                        <div className="col md-2 m-bottom-5 white-space-no text-right">
                            <span className="c-pointer" onClick =
                            {() => {
                                handleEditButton(
                                    hourlyPrices.id,
                                    field.facilityFieldId,
                                    field.fieldId,
                                    undefined,
                                    undefined,
                                    hourlyPrices.date ?? undefined,
                                    hourlyPrices.dayOfWeek ?? undefined,
                                    hourlyPrices.startTime,
                                    hourlyPrices.endTime,
                                    false,
                                    hourlyPrices.price
                                )
                                setStartTime(
                                    hourlyPrices.startTime && hourlyPrices.startTime.trim() !== ""
                                        ? parseTimeStringToDate(hourlyPrices.startTime)
                                        : null
                                    );
                                    setEndTime(
                                    hourlyPrices.endTime && hourlyPrices.endTime.trim() !== ""
                                        ? parseTimeStringToDate(hourlyPrices.endTime)
                                        : null
                                    );
                                }
                            }>
                            <TbClockEdit size={22}/></span>
                            <span className="m-left-10 c-pointer" onClick={() => handleDeleteButton(hourlyPrices.id)}><TbTrash size={22} color="#aa1e3c"/></span>
                            
                        </div>)}
                    </div>
                </li>
            ))}
            </ul>
        </div>
        ))}

        {isPopupOpen == "update" && (
        <div className="popup__overlay">
            <div className="popup">
                <div className="popup__content">
                    
                    {formMsg == '' ?
                        <form action={formEditAction}>
                            <p className="m-bottom-30">
                            Edit hourly prices{" "}
                            <span className="semi-bold">
                                {editData?.dayOfWeek != null
                                ? formatDay(editData.dayOfWeek, true)
                                : editData?.date != null
                                ? new Date(editData.date).toLocaleDateString("hr-HR", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                    })
                                : ""}
                            </span>
                            </p>            
                        <input type="hidden" name='id' value={editData?.id}/>
    
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
                                <label htmlFor="price">Price</label>
                                <input type="number" name="price" id="price" step=".01" onChange={handleChangePrice}/>
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
        </div>
        )}
    
        {isPopupOpen == "create" && (
            <div className="popup__overlay">
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

                                    <select id="week_day" name="week_day" className="input">
                                        <option value="">All days</option>
                                        {allDaysOfWeek
                                        .map((day) => (
                                            <option key={day.value} value={day.value}>
                                            {day.label}
                                            </option>
                                        ))}
                                    </select>
                                    
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
                                <label htmlFor="price">Price</label>
                                <input type="number" name="price" id="price" step=".01"/>
                            </div>
                        </div>

                        <div className="two-col-grid">
                            <button type="button" onClick={() => setIsPopupOpen("")}>Cancel</button>
                            <button type='submit' disabled={isCreatePending}>Confirm</button>
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
            </div>
        )}
    
        {isPopupOpen == "delete" && (
        <div className="popup__overlay">
            <div className="popup">
                <div className="popup__content">
                {formMsg == '' ?
                                        
                    <form action={formDeleteAction}>
                        <p className="m-bottom-20">Do you really want to delete this hourly price?</p>
                        <input type="hidden" name="id" value={deleteId} />
                        <div className="two-col-grid">
                            <button type="button" onClick={() => setIsPopupOpen("")}>Cancel</button>
                            <button type='submit' disabled={isDeletePending}>Confirm</button>
                        </div>
                    </form>                
                    : 
                    <div>
                        <p className="m-bottom-20">{formMsg}</p>
                        <button onClick={() => {refreshFacilityData()}}>Ok</button>
                    </div>}
                </div>
            </div>
        </div>
        )}
    
        {isAdmin && (
        <button onClick={() => handleCreateButton()}>Add hourly price</button>)}
            
    </div>
    )
}

export default HourlyPrices