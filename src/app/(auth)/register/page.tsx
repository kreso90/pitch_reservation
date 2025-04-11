"use client"
import { createUser } from "@/app/actions/actions";
import React, { useActionState } from "react";

export default function RegisterPage() {
  const [error, formAction, isPending] = useActionState(createUser, null);
  
  return (
    <form action={formAction} className="p-4">
      <input 
        name="name" 
        placeholder="Username"/>
      
      <input 
        name="email" 
        placeholder="Email"/>
      
      <input
        name="password"
        placeholder="Lozinka"
        type="password"/>

      <button type="submit" disabled={isPending}>
        Sing up
      </button>
      <div>{isPending ? "loading" : ""}</div>
      <div>{error ? error as string : ''}</div>
    </form>
  );
}
