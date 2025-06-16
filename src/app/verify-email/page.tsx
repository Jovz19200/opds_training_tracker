'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { verifyEmail } from '@/redux/api/authApiSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setError('No verification token provided. Please check your email for the correct verification link.')
        setIsVerifying(false)
        return
      }

      try {
        const result = await dispatch(verifyEmail({ token })).unwrap()
        setIsVerified(true)
        // Clear any error if verification succeeds
        setError(null)
      } catch (err: any) {
        console.error('Verification error:', err)
        setError(err.message || 'Failed to verify email. The verification link may have expired or is invalid.')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmailToken()
  }, [searchParams, dispatch])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleResendVerification = () => {
    // TODO: Implement resend verification email functionality
    router.push('/login?resend=true')
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {isVerifying ? 'Verifying your email...' : 
             isVerified ? 'Your email has been verified successfully!' :
             'Email verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {isVerifying ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Please wait while we verify your email...</p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-center text-muted-foreground">
                Your email has been verified successfully. You can now log in to your account.
              </p>
              <Button onClick={handleLogin} className="w-full">
                Go to Login
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-center text-muted-foreground">
                {error || 'Failed to verify your email. The verification link may have expired.'}
              </p>
              <div className="flex flex-col gap-2 w-full">
                <Button onClick={handleResendVerification} variant="outline" className="w-full">
                  Resend Verification Email
                </Button>
                <Button onClick={handleLogin} variant="outline" className="w-full">
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 