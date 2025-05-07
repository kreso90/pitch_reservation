"use client"
import { createUser } from "@/app/actions/actions";
import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import React, { useActionState } from "react";
import { TbBrandGoogleFilled  } from "react-icons/tb";


export default function RegisterPage() {
  const [error, formAction, isPending] = useActionState(createUser, null);
  const { handleGoogleLogin, isSubmitting } = useAuth();

  return (
    <div className="flex justify-center">
        <div className="form__wrapper m-side-10">

            <form action={formAction}>

                <h1 className="form__title">Create your account</h1>

                <div className="form__field">
                    <label htmlFor="name">Username</label>
                    <input 
                        id="name"
                        name="name" 
                        placeholder="Username"/>
                </div>
            
                <div className="form__field">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email"
                        name="email" 
                        placeholder="Email"/>
                </div>

                <div className="form__field">
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        name="password" 
                        placeholder="Password"
                        type="password"/>
                </div>
                
                <div className="form__field m-bottom-30">
                    <label htmlFor="confirm_password">Confirm password</label>
                    <input
                        id="confirm_password"
                        name="confirm_password"
                        placeholder="Confirm password"
                        type="password"/>
                </div>

                <button type="submit" disabled={isPending}>Sign up</button>
            
                <div className="form__error">{error ? error as string : ''}</div>
                <div className="border-title m-top-30 m-bottom-30"><span>or sign up with</span></div>
                
            </form>
            <button onClick={handleGoogleLogin}><TbBrandGoogleFilled size={20} />Sign up with Google</button>
            <small>Already have an account? <Link href="/login">Login here</Link></small>

            {isPending || isSubmitting ? <Loader/> : null}
        </div>
    </div>
  );
}
