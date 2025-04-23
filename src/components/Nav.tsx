import useAuth from "@/hooks/useAuth";
import React from "react";
import { TbSoccerField, TbCalendarMonth, TbClockHour4, TbLogout } from "react-icons/tb";

type NavProps = {
    activeView: 'calendar' | 'reservations';
    setActiveView: (view: 'calendar' | 'reservations') => void;
};

export default function Nav({ activeView, setActiveView }: NavProps) {
  const { handleSingOut } = useAuth();
  return (
    <div>
        <nav>
            <ul>
                <li onClick={() => setActiveView('calendar')} >
                    <TbCalendarMonth size={20} />
                    <span>Calendar</span>
                </li>
                <li>
                    <TbSoccerField size={20} />
                    <span>Fields</span>
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
  );
}
