import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";
import { TbHomeCog, TbCalendarMonth, TbClockHour4, TbLogout, TbHome } from "react-icons/tb";

type NavProps = {
    activeView: 'facility' | 'calendar' | 'reservations';
    setActiveView: (view: 'facility' | 'calendar' | 'reservations') => void;
    isAdmin: boolean
};

export default function Nav({ activeView, setActiveView, isAdmin }: NavProps) {
  const { handleSingOut } = useAuth();

  const [ toggleNav, setToggleNav ] = useState(false);

  return (
    <>
    <span className={`nav__hamburger ${toggleNav ? "open" : "" }`} onClick={() => setToggleNav(prev => !prev)}>
        <span></span>
        <span></span>
        <span></span>
    </span>
    <div className={`nav ${toggleNav ? "open" : "" }`}>

        <nav>
            <ul>
                <li onClick={() => setActiveView('facility')}>
                    {isAdmin ? <TbHomeCog  size={20} /> : <TbHome size={20} />}
                    <span>Facility {isAdmin ? "settings" : "info"}</span>
                </li>

                <li onClick={() => setActiveView('calendar')} >
                    <TbCalendarMonth size={20} />
                    <span>Calendar</span>
                </li>
             
                <li onClick={() => setActiveView('reservations')} >
                    <TbClockHour4 size={20} />
                    <span>Reservations</span>
                </li>

                <li>
                    <TbLogout size={20} />
                    <span onClick={handleSingOut}>Logout</span>
                </li>

            </ul>
        </nav>
    </div>
    </> 
  );
}
