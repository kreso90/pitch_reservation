import { WorkingHours } from '@prisma/client';
import React, { useState } from 'react'

const useFacilitySettings = () => {
    const [ workingHoursId, setWorkingHoursId ] = useState<string>("");
    const [ startTime, setStartTime ] = useState<Date | null>(null);
    const [ endTime, setEndTime ] = useState<Date | null>(null);
    const [ date, setDate ] = useState<Date | null>(null);
    const [ workingHours, setWorkingHours ] = useState<WorkingHours | null>(null)
    const [ isPopupOpen, setIsPopupOpen ] = useState<'create' | 'update' | 'delete' | ''>('');
    const [ formMsg, setFormMsg ] = useState<string>('')
    const [ selectedField, setSelectedField ] = useState<string>('')
    const [ ruleType, setRuleType ] = useState<string>("");

    const handleEditWorkingHours = (
        id: string,
        facilityId: string,
        fieldId?: string | null,
        date?: Date,
        dayOfWeek?: number,
        startTime?: string,
        endTime?: string,
        isClosed?: boolean,

    ) => {
        setIsPopupOpen("update")
        setWorkingHours({id: id, facilityId: facilityId, date: date ?? null, fieldId: fieldId ?? null, dayOfWeek: dayOfWeek ?? null, startTime: startTime ?? '', endTime: endTime ?? '', isClosed: isClosed ?? false})
    }

    const handleCreateWorkingHours = () => {
        setIsPopupOpen("create")
    }

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRuleType(e.target.value);
    };

    const handleDeleteButton = (
        id: string,
    ) => {
        setIsPopupOpen("delete")
        setWorkingHoursId(id);
    }

   return { workingHours, setWorkingHours, handleEditWorkingHours, handleCreateWorkingHours, isPopupOpen, setIsPopupOpen, startTime, setStartTime, endTime, setEndTime, formMsg, setFormMsg, selectedField, setSelectedField, date, setDate, ruleType, setRuleType, handleRadioChange, workingHoursId, setWorkingHoursId, handleDeleteButton }
}

export default useFacilitySettings