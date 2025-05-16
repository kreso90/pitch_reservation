import { FacilityWithFields, FacilityWithUser, UserWithReservations } from '@/types/facilityData';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const useFacilityData = () => {
    const { id } = useParams();
    const [ loading, setLoading ] = useState(false);
    const [ facilityData, setFacilityData ] = useState<FacilityWithFields | null>(null);
    const [ user, setUser ] = useState<UserWithReservations | null>(null);
    const [ selectedFieldId, setSelectedFieldId ] = useState<string>('');
    const [ activeView, setActiveView ] = useState< 'home' | 'facility' | 'calendar' | 'reservations'>('facility');

    const getFacilityData = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/facility/${id}`);

            if (!res.ok) {
                throw new Error(`Error status: ${res.status}`);
            }
    
            const data: FacilityWithUser = await res.json();
            setFacilityData(data.facility);
            setUser(data.user);

            if(data.facility.facilityFields.length > 0){
                setSelectedFieldId(data.facility.facilityFields[0].fieldId ?? '');
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

    return { loading, facilityData, user, selectedFieldId, refreshFacilityData, activeView, setActiveView }
}

export default useFacilityData