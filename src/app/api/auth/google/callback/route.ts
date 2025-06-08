import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect('/login?error=No code provided')
  }

  try {
    // Send code to your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_OTMS_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to authenticate')
    }

    // Set cookies
    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.token, {
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    cookieStore.set('userInfo', JSON.stringify(data.user), {
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    // Redirect to dashboard with user role
    return NextResponse.redirect(`/${data.user.role}dashboard`)
  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.redirect('/login?error=Authentication failed')
  }
} 