"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { verifyEmail } from "@/redux/api/authApiSlice"
import OTMSLoader from "@/components/OTMSLoader"
import "@/components/OTMSLoaderOverlay.css"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showOTMSLoader, setShowOTMSLoader] = useState(false)

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setError("No verification token provided")
      return
    }

    const verifyEmailToken = async () => {
      setIsLoading(true)
      setShowOTMSLoader(true)

      try {
        const result = await dispatch(verifyEmail({ token }))
        if (verifyEmail.fulfilled.match(result)) {
          setSuccess(true)
        } else {
          setError(result.payload as string)
        }
      } catch (err) {
        setError("Failed to verify email. Please try again.")
      } finally {
        setIsLoading(false)
        setShowOTMSLoader(false)
      }
    }

    verifyEmailToken()
  }, [dispatch, searchParams])

  const handleResendVerification = () => {
    // TODO: Implement resend verification functionality
    console.log("Resend verification clicked")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <Card className="otms-loader-relative">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
              <CardDescription className="text-center">
                {isLoading ? "Verifying your email..." : success ? "Email verified successfully!" : "Please wait while we verify your email"}
              </CardDescription>
            </CardHeader>
            <CardContent>
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

                {success ? (
                  <div className="text-center space-y-4">
                    <p className="text-green-600">Your email has been verified successfully!</p>
                    <Button asChild>
                      <Link href="/login">Proceed to Login</Link>
                    </Button>
                  </div>
                ) : error ? (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Unable to verify your email. You can try resending the verification email.</p>
                    <Button onClick={handleResendVerification}>
                      Resend Verification Email
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="w-full max-w-md px-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Loading...</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
} 