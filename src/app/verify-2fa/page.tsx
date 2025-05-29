"use client"

import dynamic from 'next/dynamic'

const Verify2FAContent = dynamic(() => import('./Verify2FAContent'), {
  ssr: false
})

export default function Verify2FAPage() {
  return <Verify2FAContent />
} 