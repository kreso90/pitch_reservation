import { FacilityFields, HourlyPricing, WorkingHours } from '@prisma/client';
import React, { useState } from 'react'

type CombinedEditData = {
    id?: string;
    facilityId: string,
    fieldId?: string;
    facilityFieldId?: string;
    fieldName?: string;
    fieldType?: string;
    date?: Date;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    isClosed?: boolean;
    price?: number;
};

type FieldData = {
    fieldName: string;
    fieldType: string;
    fieldPrice: number;
}

type FacilityData = {
    name: string,
    desc: string,
    address: string,
    email: string,
    telephone: string,
    startTime: string,
    endTime: string,
    fieldTypes: string[] 
}

export const popularSports = ["Football", "Basketball", "Handball", "Tennis", "Padel", "Paintball"];

const useFacilitySettings = () => {
    const [ deleteId, setDeleteId ] = useState<string>("");
    const [ startTime, setStartTime ] = useState<Date | null>(null);
    const [ endTime, setEndTime ] = useState<Date | null>(null);
    const [ price, setPrice ] = useState<number>(0);
    const [ date, setDate ] = useState<Date | null>(null);
    const [ fieldData, setFieldData ] = useState<FieldData>({
        fieldName: '',
        fieldType: '',
        fieldPrice: 0,
    });

    const [ facilityEditData, setfacilityData ] = useState<FacilityData>({
        name: '',
        desc: '',
        address: '',
        email: '',
        telephone: '',
        startTime: '',
        endTime: '',
        fieldTypes: [] 
    });
    const [ editData, setEditData ] = useState<CombinedEditData | null>(null);
    const [ isPopupOpen, setIsPopupOpen ] = useState<'create' | 'update' | 'delete' | ''>('');
    const [ formMsg, setFormMsg ] = useState<string>('')
    const [ selectedField, setSelectedField ] = useState<string>('')
    const [ ruleType, setRuleType ] = useState<string>('');

    const handleEditButton = (
        id: string,
        facilityId: string,
        fieldId?: string,
        fieldName?: string,
        fieldType?: string,
        date?: Date,
        dayOfWeek?: number,
        startTime?: string,
        endTime?: string,
        isClosed?: boolean,
        price?: number
    ) => {
        setIsPopupOpen("update")
        setEditData({id: id, facilityId: facilityId ?? undefined, fieldName: fieldName ?? undefined, fieldType: fieldType ?? undefined, date: date ?? undefined, fieldId: fieldId ?? undefined, dayOfWeek: dayOfWeek ?? undefined, startTime: startTime ?? undefined, endTime: endTime ?? undefined, isClosed: isClosed ?? false, price: price ?? 0})
    }

    const handleCreateButton = () => {
        setIsPopupOpen("create")
    }

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRuleType(e.target.value);
    };

    const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(Number(e.target.value));
    };

    const handleFieldChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: string,
        dataType: 'fieldData' | 'facilityData'
    ) => {
        const value = e.target.value;
    
        if (dataType === 'fieldData') {
            setFieldData({
                ...fieldData,
                [field]: field === 'fieldPrice' ? Number(value) : value,
            });
        } else if (dataType === 'facilityData') {
            setfacilityData({
                ...facilityEditData,
                [field]: value,
            });
        }
    };

    const handleEditFacilityButton = (
        name: string,
        desc: string,
        address: string,
        email: string,
        telephone: string,
        startTime: string,
        endTime: string,
        fieldTypes: string[] 
    ) => {
        setIsPopupOpen("update")
        setfacilityData({name: name, desc: desc, address: address, email: email, telephone: telephone, startTime: startTime, endTime: endTime, fieldTypes: fieldTypes})
    };
      
      
    const handleDeleteButton = (
        id: string,
    ) => {
        setIsPopupOpen("delete")
        setDeleteId(id);
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
      
        if (checked) {
          setfacilityData((prev) => ({
            ...prev,
            fieldTypes: [...prev.fieldTypes, value],
          }));
        } else {
          setfacilityData((prev) => ({
            ...prev,
            fieldTypes: prev.fieldTypes.filter((sport) => sport !== value),
          }));
        }
      };
      

    return { editData, handleEditButton, handleCreateButton, isPopupOpen, setIsPopupOpen, startTime, setStartTime, endTime, setEndTime, formMsg, setFormMsg, selectedField, setSelectedField, date, setDate, ruleType, setRuleType, handleRadioChange, deleteId, handleDeleteButton, price, setPrice, handleChangePrice, fieldData, setFieldData, handleFieldChange, facilityEditData, setfacilityData, handleEditFacilityButton, handleCheckboxChange }
}

export default useFacilitySettings