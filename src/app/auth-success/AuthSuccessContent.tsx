"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { handleGoogleAuthToken } from "@/redux/api/loginApiSlice"
import { setUser } from "@/redux/reducers/authSlice"
import type { AppDispatch } from "@/redux/store"
import OTMSLoader from "@/components/OTMSLoader"
import "@/components/OTMSLoaderOverlay.css"

export default function AuthSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      dispatch(handleGoogleAuthToken(token))
        .unwrap()
        .then((result) => {
          if (!result.user) {
            router.push('/login?error=No user data received');
            return;
          }

          // Check if user has required fields
          if (!result.user.role) {
            router.push('/login?error=User data is incomplete');
            return;
          }

          dispatch(setUser(result.user));
          const dashboardPath = `/${result.user.role}dashboard`;
          router.push(dashboardPath);
        })
        .catch((error) => {
          router.push('/login?error=Authentication failed');
        });
    } else {
      router.push('/login?error=No token provided');
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="otms-loader-relative">
        <OTMSLoader />
      </div>
    </div>
  );
} 