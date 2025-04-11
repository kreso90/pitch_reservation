"use client";
import useAuth from "@/hooks/useAuth";
import { useSession } from "next-auth/react";

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
