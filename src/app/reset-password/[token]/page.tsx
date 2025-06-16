"use client"

import dynamic from 'next/dynamic'

const ResetPasswordContent = dynamic(() => import('./ResetPasswordContent'), {
  ssr: false
})

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return <ResetPasswordContent token={params.token} />
} 