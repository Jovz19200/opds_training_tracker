"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import OTMSLoader from "@/components/OTMSLoader"

const AuthSuccessContent = dynamic(() => import('./AuthSuccessContent'), {
  ssr: false
})

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="otms-loader-relative">
          <OTMSLoader />
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  )
} 