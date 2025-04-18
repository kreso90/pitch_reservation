import useAuth from "@/hooks/useAuth";
import React from "react";
import { TbSoccerField, TbCalendarMonth, TbClockHour4, TbLogout } from "react-icons/tb";

export default function Nav() {
  const { handleSingOut } = useAuth();
  return (
    <div>
        <nav>
            <ul>
                <li>
                    <TbCalendarMonth size={20} />
                    <span>Calendar</span>
                </li>
                <li>
                    <TbSoccerField size={20} />
                    <span>Fields</span>
                </li>
                <li>
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
