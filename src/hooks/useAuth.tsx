import React, { useState } from 'react'
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string>('')
    const router = useRouter();
    
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";
        
        try {
            const response = await signIn("credentials", { email, password, redirect: false});
            
            if (response?.error) {
                setAuthError("Invalid email or password");
            }else{
                router.push("/")
            }

        } catch (error) {
            if (error instanceof Error) {
                setAuthError(error.message);
            } else {
                setAuthError("An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false)
        }
    };

    const handleGoogleLogin = () => {
        setIsSubmitting(true)
        try{
            signIn("google", { redirect: true, callbackUrl: "/" });
        } catch(error){
            if (error instanceof Error) {
                setAuthError(error.message);
            } else {
                setAuthError("An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false)
        }
    };

    const handleSingOut = async () => {
        await signOut({ redirect: true, callbackUrl: "/login" });
    }
    

    return{ handleSingOut, handleLogin, handleGoogleLogin, isSubmitting, authError };
}

export default useAuth