import { FacilityWithFields } from '@/types/facilityData';
import React, { useEffect, useState } from 'react'

const useFacilityData = () => {
    const [ loading, setLoading ] = useState(false);
    const [ facilityData, setFacilityData ] = useState<FacilityWithFields | null>(null);
    const [ selectedFieldId, setSelectedFieldId ] = useState<string>('');
    const [ activeView, setActiveView ] = useState<'calendar' | 'reservations'>('calendar');

    const getFacilityData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/facility');

            if (!res.ok) {
                throw new Error(`Error status: ${res.status}`);
            }
    
            const data: FacilityWithFields = await res.json();
            setFacilityData(data);
            setSelectedFieldId(data.facilityFields[0].fieldId ?? '');
        } catch (error) {
            console.error('Error facility data:', error);
        } finally {
            setLoading(false)
        }
    };

    const refreshFacilityData = async () => {
        await getFacilityData();
    };

    useEffect(() => {
        getFacilityData()
    }, [])

    return { loading, facilityData, selectedFieldId, refreshFacilityData, activeView, setActiveView }
}

export default useFacilityData