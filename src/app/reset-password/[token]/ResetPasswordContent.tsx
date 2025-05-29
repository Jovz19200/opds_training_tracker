"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, KeyRound } from "lucide-react"
import axios from "@/redux/api/api"
import OTMSLoader from "@/components/OTMSLoader"
import "@/components/OTMSLoaderOverlay.css"

interface ResetPasswordContentProps {
  token: string
}

export default function ResetPasswordContent({ token }: ResetPasswordContentProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showOTMSLoader, setShowOTMSLoader] = useState(false)

  const validatePassword = (password: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) {
      return "Password must be at least 8 characters long"
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter"
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter"
    }
    if (!hasNumbers) {
      return "Password must contain at least one number"
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate password
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setShowOTMSLoader(true)

    try {
      await axios.put(`/auth/resetpassword/${token}`, { password })
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to reset password")
    } finally {
      setLoading(false)
      setShowOTMSLoader(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-background rounded-lg border p-8 shadow-sm otms-loader-relative">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground mt-1">
                Enter your new password below
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

              {success ? (
                <div className="text-center">
                  <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
                    Password has been reset successfully. Redirecting to login...
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      New Password
                    </label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
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
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input 
                      id="confirmPassword" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full"
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
                      <>
                        <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link href="/login" className="text-sm text-primary hover:underline">
                      Back to login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 