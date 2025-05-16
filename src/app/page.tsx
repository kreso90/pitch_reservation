"use client";

import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import UserReservationList from "@/components/UserReservationList";
import useFacilities from "@/hooks/useFacilities";

import Link from "next/link";

export default function Home() {

  const { loading, facilities, user, activeView, setActiveView, refreshUserData } = useFacilities();

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="row">
            <div className="main__col">
               {facilities ? <Nav activeView={activeView} setActiveView={setActiveView} isAdmin={false} user={user ?? undefined}/> : null}
            </div>
            
            <div className="main__col">
              
              {activeView === 'home' && facilities ? ( <div>
                <div className="row m-bottom-40">
                    {facilities &&
                    facilities?.filter((f) => f.facilityAdminId === user?.id)
                        .length > 0 && (
                        <div className="col m-bottom-30">
                          <h2>My facilities</h2>
                        </div>
                    )}

                    {facilities
                    ?.filter((f) => f.facilityAdminId === user?.id)
                    .map((facility) => (
                        <div key={facility.facilityId} className="col md-4 xl-3 m-bottom-20">
                            <Link href={`/facility/${facility.facilityId}`}>
                            <div className="grey-box">
                                <div className="m-bottom-20">
                                    <h3 className="m-bottom-5">{facility.facilityName}</h3>
                                    <p className="regular">{facility.facilityAddress}</p>
                                </div>
                                {facility?.facilityFieldTypes.map((type, index, arr) => (
                                    <span key={type}>
                                    {type}{index < arr.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="row">
                    <div className="col m-bottom-30">
                        <h2>Facilities</h2>
                    </div>

                    {facilities?.filter((f) => f.facilityAdminId != user?.id).map((facility) => (
                    <div key={facility.facilityId} className="col md-4 xl-3 m-bottom-20">
                        <Link href={`/facility/${facility.facilityId}`}>
                        <div className="grey-box">
                            <div className="m-bottom-20">
                                <h3 className="m-bottom-5">{facility.facilityName}</h3>
                                <p className="regular">{facility.facilityAddress}</p>
                            </div>
                            {facility?.facilityFieldTypes.map((type, index, arr) => (
                                <span key={type}>
                                {type}{index < arr.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                        </Link>
                    </div>
                    ))}
                </div>
              </div>) : activeView === 'reservations' && facilities ? (
                  <UserReservationList 
                  userReservations={user?.fieldReservation ?? []}
                  refreshFacilityData={refreshUserData}/>
              ) : null}
              
            </div>
          </div>
         
        </div>
      )}
    </>
  );
}
