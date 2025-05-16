import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TbHomeCog, TbCalendarMonth, TbClockHour4, TbLogout, TbHome, TbSoccerField } from "react-icons/tb";
import { usePathname } from 'next/navigation';
import { User } from "@prisma/client";
import { UserWithReservations } from "@/types/facilityData";

type NavProps = {
    activeView: 'home' | 'facility' | 'calendar' | 'reservations';
    setActiveView: (view: 'home' | 'facility' | 'calendar' | 'reservations') => void;
    isAdmin: boolean,
    user?: UserWithReservations;
};

export default function Nav({ activeView, setActiveView, isAdmin, user }: NavProps) {
    const { handleSingOut } = useAuth();
    const router = useRouter();
    const [ toggleNav, setToggleNav ] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return (
    <>
        <span className={`nav__hamburger ${toggleNav ? "open" : "" }`} onClick={() => setToggleNav(prev => !prev)}>
            <span></span>
            <span></span>
            <span></span>
        </span>
        <div className={`nav ${toggleNav ? "open" : "" }`}>

            <nav>
                {!isHomePage ? (
                <ul>
                    <li onClick={() => router.push("/")}>
                        <TbHome size={20} />
                        <span>Home</span>
                    </li>

                    <li onClick={() => setActiveView('facility')}>
                        <TbSoccerField size={20} />
                        <span>Facility</span>
                    </li>

                    <li onClick={() => setActiveView('calendar')} >
                        <TbCalendarMonth size={20} />
                        <span>Calendar</span>
                    </li>
                
                    {isAdmin && user ? <li onClick={() => setActiveView('reservations')} >
                        <TbClockHour4 size={20} />
                        <span>Reservations</span>
                    </li> : null}

                    <li>
                        <TbLogout size={20} />
                        <span onClick={handleSingOut}>Logout</span>
                    </li>

                </ul> 
                ) : (
                <ul>
                    <li onClick={() => setActiveView('home')} >
                        <TbHome size={20} />
                        <span>Home</span>
                    </li>

                    <li onClick={() => setActiveView('reservations')} >
                        <TbClockHour4 size={20} />
                        <span>My reservations</span>
                    </li>

                    <li>
                        <TbLogout size={20} />
                        <span onClick={handleSingOut}>Logout</span>
                    </li>
                </ul>
                )}

            </nav>
        </div>
    </> 
  );
}
