"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield } from "lucide-react"
import { setUser } from "@/redux/reducers/authSlice"
import { verify2FA } from "@/redux/api/verify2FAApiSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import Cookies from "js-cookie"
import OTMSLoader from "@/components/OTMSLoader"
import "@/components/OTMSLoaderOverlay.css"

export default function Verify2FAContent() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const { loading, error } = useSelector((state: RootState) => state.verify2FA)
  
  const [otp, setOtp] = useState("")
  const [showOTMSLoader, setShowOTMSLoader] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (!emailParam) {
      router.push("/login")
      return
    }
    setEmail(emailParam)
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      const result = await dispatch(verify2FA({ email, twoFAToken: otp }))
      
      if (verify2FA.fulfilled.match(result)) {
        const { token, user } = result.payload

        // Set cookies with security options
        Cookies.set("accessToken", token, {
          secure: true,
          sameSite: 'strict',
          expires: 7 // 7 days
        })
        Cookies.set("userInfo", JSON.stringify(user), {
          secure: true,
          sameSite: 'strict',
          expires: 7 // 7 days
        })

        // Update Redux state
        dispatch(setUser(user))

        // Show loader and redirect
        setShowOTMSLoader(true)
        setTimeout(() => {
          router.push(`/${user.role}dashboard`)
        }, 1200)
      }
    } catch (err) {
      console.error("2FA verification error:", err)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-background rounded-lg border p-8 shadow-sm otms-loader-relative">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
              <p className="text-muted-foreground mt-1">
                Enter the verification code from your authenticator app
              </p>
            </div>

            {showOTMSLoader && (
              <div className="otms-loader-overlay">
                <OTMSLoader />
              </div>
            )}

            <div className={showOTMSLoader ? "otms-loader-blur" : undefined}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    className="w-full text-center tracking-widest text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center"
                  disabled={loading || showOTMSLoader}
                >
                  {loading && !showOTMSLoader ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 