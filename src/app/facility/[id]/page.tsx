"use client";
import Calendar from "@/components/Calendar";
import WorkingHours from "@/components/WorkingHours";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import ReservationsList from "@/components/ReservationsList";
import useFacilityData from "@/hooks/useFacilityData";
import HoursPrices from "@/components/HourlyPrices";
import { Fields } from "@/components/Fields";
import Facility from "@/components/Facility";

export default function FacilityPage() {
  const {
    loading,
    facilityData,
    user,
    selectedFieldId,
    refreshFacilityData,
    activeView,
    setActiveView,
  } = useFacilityData();
  const isAdmin = facilityData?.facilityAdminId === user?.id;

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="main__col">
              {facilityData ? <Nav
                activeView={activeView}
                setActiveView={setActiveView}
                isAdmin={isAdmin ?? false}
                user={user ?? undefined}
              /> : null}
            </div>

            <div className="main__col">
              {activeView === "facility" && facilityData ? (
                <div className="row">
                  <div className="col md-6">
                    <Facility
                      refreshFacilityData={refreshFacilityData}
                      facilityData={facilityData}
                      isAdmin={isAdmin ?? false}
                    />
                  </div>
                  <div className="col md-6">
                    <Fields
                      refreshFacilityData={refreshFacilityData}
                      facilityData={facilityData}
                      isAdmin={isAdmin ?? false}
                    />
                  </div>
                  <div className="col md-6">
                    <HoursPrices
                      refreshFacilityData={refreshFacilityData}
                      facilityData={facilityData}
                      isAdmin={isAdmin ?? false}
                    />
                  </div>
                  <div className="col md-6">
                    <WorkingHours
                      refreshFacilityData={refreshFacilityData}
                      facilityData={facilityData}
                      isAdmin={isAdmin ?? false}
                    />
                  </div>
                </div>
              ) : activeView === "calendar" && facilityData ? (
                <Calendar
                  facilityData={facilityData}
                  initialFieldId={selectedFieldId}
                  refreshFacilityData={refreshFacilityData}
                  userId={user?.id ?? ""}
                  userName={user?.name ?? ""}
                />
              ) : activeView === "reservations" && facilityData ? (
                isAdmin && user ? (
                  <ReservationsList
                    facilityData={facilityData}
                    initialFieldId={selectedFieldId}
                    refreshFacilityData={refreshFacilityData}
                    userId={user?.id ?? ""}
                    userName={user?.name ?? ""}
                  />
                ) : null
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
