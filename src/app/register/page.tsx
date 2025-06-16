"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, EyeIcon, EyeOffIcon, Mail, UserPlus } from "lucide-react"
import { register } from "@/redux/api/loginApiSlice"
import { fetchOrganizations } from "@/redux/api/organizationApiSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import OTMSLoader from "@/components/OTMSLoader"
import "@/components/OTMSLoaderOverlay.css"

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.login)
  const { organizations, loading: orgLoading } = useSelector((state: RootState) => state.organizations)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  
  useEffect(() => {
    dispatch(fetchOrganizations())
  }, [dispatch])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === "confirmPassword" || name === "password") {
      validatePasswords(name === "password" ? value : formData.password, name === "confirmPassword" ? value : formData.confirmPassword)
    }
  }
  
  const validatePasswords = (password: string, confirmPassword: string) => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match")
    } else if (password.length > 0 && password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
    } else {
      setPasswordError("")
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordError) return
    if (!agreeTerms) return
    
    const start = Date.now()
    const result = await dispatch(register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      organization: formData.organization
    }))
    
    if (register.fulfilled.match(result)) {
      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        organization: ""
      })
      setAgreeTerms(false)
      setPasswordError("")
      
      // Add delay for better UX
      const elapsed = Date.now() - start
      const minDelay = 1200
      if (elapsed < minDelay) {
        setTimeout(() => {
          router.push("/login?message=Registration successful! Please verify your email to continue.")
        }, minDelay - elapsed)
      } else {
        router.push("/login?message=Registration successful! Please verify your email to continue.")
      }
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-background rounded-lg border p-8 shadow-sm otms-loader-relative">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground mt-1">Join OTMS to manage your training programs</p>
            </div>
            {loading && (
              <div className="otms-loader-overlay">
                <OTMSLoader />
              </div>
            )}
            <div className={loading ? "otms-loader-blur" : undefined}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              
              {/* <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or register with email</span>
                </div>
              </div> */}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium">
                    Organization
                  </label>
                  <select
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select an organization</option>
                    {organizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                  {orgLoading && (
                    <p className="text-sm text-muted-foreground">Loading organizations...</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
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
                    className={`border ${agreeTerms ? "bg-primary border-primary" : "bg-background border-input"} rounded flex items-center justify-center h-4 w-4 cursor-pointer`}
                    onClick={() => setAgreeTerms(!agreeTerms)}
                  >
                    {agreeTerms && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <label 
                    className="ml-2 text-sm text-muted-foreground cursor-pointer"
                    onClick={() => setAgreeTerms(!agreeTerms)}
                  >
                    I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center"
                  disabled={loading || !agreeTerms || !!passwordError}
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Create Account
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in
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