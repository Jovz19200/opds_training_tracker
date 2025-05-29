"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, EyeIcon, EyeOffIcon, LogIn } from "lucide-react"
import { login, clearLoginState } from "@/redux/api/loginApiSlice"
import { handleNon2FALogin } from "@/redux/api/verify2FAApiSlice"
import { setUser } from "@/redux/reducers/authSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import OTMSLoader from "@/components/OTMSLoader"
import "@/components/OTMSLoaderOverlay.css"

export default function LoginContent() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.login)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showOTMSLoader, setShowOTMSLoader] = useState(false)

  // Clear login state when component mounts
  useEffect(() => {
    dispatch(clearLoginState())
  }, [dispatch])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(`/${user.role}dashboard`)
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await dispatch(login({ email, password }))
      
      if (login.fulfilled.match(result)) {
        const response = result.payload

        // Check if 2FA is required
        if (response.twoFARequired) {
          // Redirect to 2FA verification page
          router.push(`/verify-2fa?email=${encodeURIComponent(email)}`)
          return
        }

        // Normal login flow - use handleNon2FALogin to set user state
        if (!response.user) {
          throw new Error("User data not found in response")
        }

        if (!response.user.role) {
          throw new Error("User role not found in response")
        }

        // Handle non-2FA login
        await dispatch(handleNon2FALogin(response))

        setShowOTMSLoader(true)
        setTimeout(() => {
          router.push(`/${response.user.role}dashboard`)
        }, 1200)
      } else if (login.rejected.match(result)) {
        throw new Error(result.payload?.message || "Login failed")
      }
    } catch (err: any) {
      console.error("Login error:", err.message)
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-background rounded-lg border p-8 shadow-sm otms-loader-relative">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground mt-1">Sign in to your OTMS account</p>
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
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password"
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
                
                <div className="flex items-center">
                  <div 
                    className={`border ${rememberMe ? "bg-primary border-primary" : "bg-background border-input"} rounded flex items-center justify-center h-4 w-4 cursor-pointer`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <label 
                    htmlFor="remember-me" 
                    className="ml-2 text-sm text-muted-foreground cursor-pointer"
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    Remember me
                  </label>
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
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 