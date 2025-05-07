"use client";
import Calendar from "@/components/Calendar";
import WorkingHours from "@/components/WorkingHours";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import ReservationsList from "@/components/ReservationsList";
import useFacilityData from "@/hooks/useFacilityData";
import { useSession } from "next-auth/react";
import HoursPrices from "@/components/HourlyPrices";
import { Fields } from "@/components/Fields";
import Facility from "@/components/Facility";
import UserReservationList from "@/components/UserReservationList";

export default function Home() {
    const { data: session } = useSession()
    const { loading, facilityData, selectedFieldId, refreshFacilityData, activeView, setActiveView } = useFacilityData();

    return (
    

    <div className="container">
        <div className="row">

            <div className="main__col">
                <Nav activeView={activeView} setActiveView={setActiveView} isAdmin={session?.user.isAdmin ?? false}/>
            </div>

            <div className="main__col">
            {loading ? (
                <Loader />
            ) : activeView === 'facility' ? (
                <div className="row">
                    <div className="col md-6">
                        <Facility 
                        refreshFacilityData={refreshFacilityData}
                        facilityData={facilityData} 
                        isAdmin={session?.user.isAdmin ?? false}
                        />
                    </div>
                    <div className="col md-6">
                        <Fields 
                        refreshFacilityData={refreshFacilityData}
                        facilityData={facilityData} 
                        isAdmin={session?.user.isAdmin ?? false}
                        />
                    </div>
                    <div className="col md-6">
                        <HoursPrices 
                        refreshFacilityData={refreshFacilityData}
                        facilityData={facilityData} 
                        isAdmin={session?.user.isAdmin ?? false}
                        />
                    </div>
                    <div className="col md-6">
                        <WorkingHours 
                        refreshFacilityData={refreshFacilityData}
                        facilityData={facilityData} 
                        isAdmin={session?.user.isAdmin ?? false}
                        />
                    </div>
                </div>
            ) : activeView === 'calendar' ? (
                <Calendar 
                facilityData={facilityData} 
                initialFieldId={selectedFieldId}
                refreshFacilityData={refreshFacilityData}
                userId={session?.user.id ?? ''}
                userName={session?.user.name ?? ''}
                />
            ) : (
                <div>
                {session?.user.isAdmin ?
                    <ReservationsList
                    facilityData={facilityData} 
                    initialFieldId={selectedFieldId}
                    refreshFacilityData={refreshFacilityData}
                    userId={session?.user.id ?? ''}
                    userName={session?.user.name ?? ''}
                    />
                    :
                    <UserReservationList 
                    facilityData={facilityData} 
                    initialFieldId={selectedFieldId}
                    refreshFacilityData={refreshFacilityData}
                    userId={session?.user.id ?? ''}
                    userName={session?.user.name ?? ''}
                    />
                }
                </div>
            )}
            </div>


        </div>
    </div>
   
  
    
  );
}
