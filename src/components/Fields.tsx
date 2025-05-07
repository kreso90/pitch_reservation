import { FacilityWithFields } from '@/types/facilityData';
import useFacilitySettings from '@/hooks/useFacilitySettings';
import React, { useActionState } from 'react'
import { TbEdit, TbTrash } from 'react-icons/tb';
import { createField, deleteField, editField } from '@/app/actions/actions';
import { formatPrice } from '@/utils/formatUtils';

type FieldsProps = {
    facilityData: FacilityWithFields | null;
    refreshFacilityData: () => void;
    isAdmin: boolean
};

export const Fields = ({facilityData, refreshFacilityData, isAdmin}: FieldsProps) => {
    const { deleteId, editData, isPopupOpen, setIsPopupOpen, formMsg, setFormMsg, fieldData, setFieldData, handleFieldChange, handleCreateButton, handleEditButton, handleDeleteButton } = useFacilitySettings();

    const [state, formEditAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await editField(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    )

    const [createState, formCreateAction, isCreatePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await createField(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    )

    const [deleteState, formDeleteAction, isDeletePending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await deleteField(prevState, formData);
            setFormMsg(result ?? '')
            return result;
        },
        null
    )
    
    return(
        <div className="m-bottom-40">

            <h2 className="m-bottom-40">Facility fields</h2>

            <ul>
            {facilityData?.facilityFields.map((field) => (
                <li key={field.fieldId} className="m-bottom-10 b-bottom-1-white">
                    <div className="row m-bottom-5">
                        <div className="col xs-3">
                            {field.fieldName}
                        </div>
                        <div className="col xs-3">
                            {field.fieldType}
                        </div>
                        <div className="col xs-3">
                            {formatPrice(field.fieldPrice ?? 0)}
                        </div>
                        {isAdmin && (
                            <div className="col xs-3 m-bottom-5 white-space-no text-right">
                                <span
                                    className="c-pointer"
                                    onClick={() => {
                                        handleEditButton(
                                            field.fieldId,
                                            field.facilityFieldId,
                                            field.fieldId,
                                            field.fieldName,
                                            field.fieldType,
                                            undefined,
                                            undefined,
                                            undefined,
                                            undefined,
                                            undefined
                                        );

                                        setFieldData({
                                            fieldName: field.fieldName,
                                            fieldType: field.fieldType,
                                            fieldPrice: 0,
                                        });
                                    }}
                                >
                                    <TbEdit size={22} />
                                </span>
                                <span className="m-left-10 c-pointer" onClick={() => handleDeleteButton(field.fieldId)}>
                                    <TbTrash size={22} color="#aa1e3c" />
                                </span>
                            </div>
                        )}
                       
                    </div>
                </li>
            ))}
            </ul>

            {isPopupOpen == "update" && (
            <div className="popup__overlay">
                <div className="popup">
                    <div className="popup__content">
                        
                        {formMsg == '' ?
                            <form action={formEditAction}>
                                <p className="m-bottom-30">
                                Edit field <span className="semi-bold">{editData?.fieldName}</span>
                                </p>            
                            <input type="hidden" name='id' value={editData?.fieldId}/>
        
                            <div className='three-md-col-grid m-bottom-30'>
        
                                <div className='form__field'>
                                    <label htmlFor="field_name">Field name</label>
                                    <input type="text" name="field_name" id="field_name" value={fieldData.fieldName} onChange={(e) => handleFieldChange(e, 'fieldName', 'fieldData')}/>
                                </div>
        
                                <div className='form__field'>
                                    <label htmlFor="field_type">Field type</label>
                                    <select className="input" name="field_type" id="field_type" value={fieldData.fieldType} onChange={(e) => handleFieldChange(e, 'fieldType', 'fieldData')}>
                                        {facilityData?.facilityFieldTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form__field'>
                                    <label htmlFor="field_price">Field price</label>
                                    <input type="text" name="field_price" id="field_price" value={fieldData.fieldPrice} onChange={(e) => handleFieldChange(e, 'fieldPrice', 'fieldData')}/>
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
                            <p className="m-bottom-30">Create new field</p>            
                            <input type="hidden" name="facility_id" value={facilityData?.facilityId} />
                            
                            <div className='three-md-col-grid m-bottom-30'>
        
                                <div className='form__field'>
                                    <label htmlFor="field_name">Field name</label>
                                    <input type="text" name="field_name" id="field_name" />
                                </div>
        
                                <div className='form__field'>
                                    <label htmlFor="field_type">Field type</label>
                                    <select className="input" name="field_type" id="field_type">
                                        {facilityData?.facilityFieldTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form__field'>
                                    <label htmlFor="field_price">Field price</label>
                                    <input type="number" name="field_price" id="field_price" />
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
                            <p className="m-bottom-20">Do you realy want to delete this working hours?</p>
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
            </div>)}

            {isAdmin && (
            <button onClick={() => handleCreateButton()}>Add field</button>)}
        </div>
    );
}
