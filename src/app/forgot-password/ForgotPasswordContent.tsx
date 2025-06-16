"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import axios from "@/redux/api/api"
import OTMSLoader from "@/components/OTMSLoader"
import "@/components/OTMSLoaderOverlay.css"

export default function ForgotPasswordContent() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showOTMSLoader, setShowOTMSLoader] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setShowOTMSLoader(true)

    try {
      await axios.post("/auth/forgotpassword", { email })
      setSuccess(true)
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send reset email")
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
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-muted-foreground mt-1">
                Enter your email address and we'll send you a link to reset your password
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
                    Password reset instructions have been sent to your email
                  </div>
                  <Link href="/login" className="text-primary hover:underline">
                    Return to login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        <Mail className="mr-2 h-4 w-4" /> Send Reset Link
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