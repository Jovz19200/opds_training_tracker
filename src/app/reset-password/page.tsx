"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, KeyRound } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { resetPassword } from "@/redux/api/authApiSlice"
import { Label } from "@/components/ui/label"
import OTMSLoader from "@/components/OTMSLoader"
import "@/components/OTMSLoaderOverlay.css"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()
  const [token, setToken] = useState<string | null>(null)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOTMSLoader, setShowOTMSLoader] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (!tokenParam) {
      setError("Invalid or missing reset token")
      return
    }
    setToken(tokenParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError("Invalid or missing reset token")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    setShowOTMSLoader(true)

    try {
      const result = await dispatch(resetPassword({ resetToken: token, password }))
      if (resetPassword.fulfilled.match(result)) {
        router.push("/login?message=Password reset successful. Please login with your new password.")
      } else {
        setError(result.payload as string)
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
      setShowOTMSLoader(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="w-full max-w-md px-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-red-500">Invalid Reset Link</CardTitle>
                <CardDescription className="text-center">
                  The password reset link is invalid or has expired. Please request a new password reset link.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <Card className="otms-loader-relative">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your new password below
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || showOTMSLoader}
                  >
                    {isLoading && !showOTMSLoader ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    <Link href="/login" className="text-primary hover:underline">
                      Back to login
                    </Link>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  )
} 