import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { API_CONFIG } from '@/lib/api/config'

export function middleware(request: NextRequest) {
  // Get stored tokens
  const token = request.cookies.get(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)?.value

  // Check if it's a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // Redirect to home if trying to access protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}