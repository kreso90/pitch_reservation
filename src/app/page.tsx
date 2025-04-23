"use client";
import Calendar from "@/components/Calendar";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import ReservationsList from "@/components/ReservationsList";
import useFacilityData from "@/hooks/useFacilityData";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
    const { data: session } = useSession()
    const { loading, facilityData, selectedFieldId, refreshFacilityData, activeView, setActiveView } = useFacilityData();

    return (
    

    <div className="container">
        <div className="row">

            <div className="main__col">
                <Nav activeView={activeView} setActiveView={setActiveView}/>
            </div>

            <div className="main__col">
            {loading ? (
                <Loader />
            ) : activeView === 'calendar' ? (
                <Calendar 
                facilityData={facilityData} 
                initialFieldId={selectedFieldId}
                refreshFacilityData={refreshFacilityData}
                userId={session?.user.id ?? ''}
                userName={session?.user.name ?? ''}
                />
            ) : (
                <ReservationsList
                facilityData={facilityData} 
                initialFieldId={selectedFieldId}
                refreshFacilityData={refreshFacilityData}
                userId={session?.user.id ?? ''}
                userName={session?.user.name ?? ''}
                />
            )}
            </div>


        </div>
    </div>
   
  
    
  );
}
