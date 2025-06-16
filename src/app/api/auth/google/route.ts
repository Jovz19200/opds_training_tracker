import { NextResponse } from 'next/server'

export async function GET() {
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_OTMS_URL}/auth/google/callback`)
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account&response_type=code&redirect_uri=${redirectUri}&scope=profile%20email&client_id=1000419452390-fh70eo4tk4epdnrfj021jrmu31619alk.apps.googleusercontent.com`
  
  return NextResponse.redirect(googleAuthUrl)
} 