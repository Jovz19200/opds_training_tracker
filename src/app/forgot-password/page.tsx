"use client"

import dynamic from 'next/dynamic'

const ForgotPasswordContent = dynamic(() => import('./ForgotPasswordContent'), {
  ssr: false
})

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />
} 