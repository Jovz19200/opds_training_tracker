import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes and their allowed roles
const protectedRoutes = {
  '/traineedashboard': ['trainee', 'admin', 'trainer'],
  '/trainerdashboard': ['trainer', 'admin'],
  '/admindashboard': ['admin'],
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const userInfo = request.cookies.get('userInfo')?.value
  const { pathname } = request.nextUrl

  // If no token, redirect to login
  if (!token) {
    if (Object.keys(protectedRoutes).some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // If user is logged in but tries to access login/register, redirect to appropriate dashboard
  if (pathname === '/login' || pathname === '/register') {
    try {
      const user = JSON.parse(userInfo || '{}')
      if (user.role) {
        return NextResponse.redirect(new URL(`/${user.role}dashboard`, request.url))
      }
    } catch (e) {
      // If userInfo is invalid, continue to login
      return NextResponse.next()
    }
  }

  // Check role-based access
  try {
    const user = JSON.parse(userInfo || '{}')
    const userRole = user.role

    // Check if the current path requires specific role
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // If user's role is not allowed, redirect to their dashboard
          return NextResponse.redirect(new URL(`/${userRole}dashboard`, request.url))
        }
        break
      }
    }
  } catch (e) {
    // If userInfo is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/traineedashboard/:path*',
    '/trainerdashboard/:path*',
    '/admindashboard/:path*',
  ],
} 