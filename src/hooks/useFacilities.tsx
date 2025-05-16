import { FacilitiesAndUserData, UserWithReservations } from '@/types/facilityData';
import { Facility } from '@prisma/client'
import React, { useEffect, useState } from 'react'

const useFacilities = () => {
    const [ loading, setLoading ] = useState(false);
    const [ user, setUser ] = useState<UserWithReservations | null>(null);
    const [ facilities, setFacilities ] = useState<Facility[] | null>(null)
    const [ activeView, setActiveView ] = useState< 'home' | 'facility' | 'calendar' | 'reservations'>('home');

    const getFacilitiesAndUser = async() => {
        setLoading(true)
        try {
            const res = await fetch("api/facilities")

        if (!res.ok) {
            throw new Error(`Error status: ${res.status}`);
        }
    
            const data: FacilitiesAndUserData = await res.json()
            setFacilities(data.facilities)
            setUser(data.user)
   
        } catch (error) {
            console.error('Error facility data:', error);
        } finally {
            setLoading(false)
        }
    }

    const refreshUserData = async () => {
        await getFacilitiesAndUser();
    };

    useEffect(() => {
        getFacilitiesAndUser()
    }, [])

    return { loading, user, facilities, activeView, setActiveView, refreshUserData }
}

export default useFacilities;