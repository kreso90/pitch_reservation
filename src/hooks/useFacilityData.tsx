import { FacilityWithFields } from '@/types/facilityData';
import { getSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const useFacilityData = () => {
    const [ loading, setLoading ] = useState(false);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ facilityData, setFacilityData ] = useState<FacilityWithFields | null>(null);
    const [ selectedFieldId, setSelectedFieldId ] = useState<string>('');
    const [ activeView, setActiveView ] = useState<'facility' | 'calendar' | 'reservations'>('calendar');

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

            const session = await getSession();
            if (session?.user.id && session.user.id === data.facilityAdminId) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
            
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
        setLoading(true)
        getFacilityData()
    }, [])

    return { loading, facilityData, selectedFieldId, refreshFacilityData, activeView, setActiveView, isAdmin }
}

export default useFacilityData