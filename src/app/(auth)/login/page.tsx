"use client";
import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import React from "react";
import { TbBrandGoogleFilled  } from "react-icons/tb";

export default function LoginPage() {
  const { handleLogin, handleGoogleLogin, isSubmitting, authError } = useAuth();
  
  return (
    <div className="flex justify-center">
        <div className="form__wrapper m-side-10">

        <form onSubmit={handleLogin}>
            <h1 className="form__title">Sign in</h1>

            <div className="form__field">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email"
                        name="email" 
                        placeholder="Email"/>
                </div>

                <div className="form__field m-bottom-30">
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        name="password" 
                        placeholder="Password"
                        type="password"/>
                </div>

            <button type="submit" disabled={isSubmitting}>Sign in</button>

            <div className="form__error">{authError ? authError as string : ''}</div>
            <div className="border-title m-top-30 m-bottom-30"><span>or sign up with</span></div>

        </form>

        <button onClick={handleGoogleLogin}><TbBrandGoogleFilled size={20} />Sign in with Google</button>
        <small>Don’t have an account? <Link href={"/register"}>Register here</Link></small>
        {isSubmitting ? <Loader/> : null}
        </div>
    </div>
  );
}
