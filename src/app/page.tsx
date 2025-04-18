"use client";
import Calendar from "@/components/Calendar";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import ReservationsList from "@/components/ReservationsList";
import useAuth from "@/hooks/useAuth";
import { useCalendar } from "@/hooks/useCalendar";
import { useSession } from "next-auth/react";

export default function Home() {
  const { handleSingOut } = useAuth();
  const calendar = useCalendar();

  return (
   
 
    <div className="container">
        <div className="row">

            <div className="main__col">
                <Nav />
            </div>

            <div className="main__col">
                <Calendar />
                <ReservationsList/>
            </div>

        </div>
    </div>
   
  
    
  );
}
