"use client";

import Image from "next/image";
import styles from "./page.module.css";
import useAuth from "@/hooks/useAuth";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { handleSingOut } = useAuth();
  const { data: session } = useSession()

  return (
    <main>
  
      <button onClick={handleSingOut}>Sing out</button>
      <div>{session?.user?.email}</div>
   
    </main>
  );
}
