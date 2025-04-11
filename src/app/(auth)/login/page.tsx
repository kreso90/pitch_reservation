"use client";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { useFormStatus } from "react-dom";

export default function LoginPage() {
  const { handleLogin, handleGoogleLogin, isSubmitting, authError } = useAuth();
  
  return (
    <>
      <form onSubmit={handleLogin} className="p-4">
        <input name="email" placeholder="Email" />
        <input name="password" placeholder="Lozinka" type="password" />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'log in' : 'logggggin'}</button>
        <div>{isSubmitting ? 'Submitting...' : 'Form ready to submit'}</div>
        <div>{authError}</div>
      </form>
      <button onClick={handleGoogleLogin}>Google login</button>
      
    </>
  );
}
