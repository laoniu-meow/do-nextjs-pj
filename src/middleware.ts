import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authenticateRequest } from './lib/auth'

export function middleware(request: NextRequest) {
  // Protect API routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/admin') || 
      request.nextUrl.pathname.startsWith('/api/users') ||
      request.nextUrl.pathname.startsWith('/api/companies') ||
      request.nextUrl.pathname.startsWith('/api/contents')) {
    
    // Skip authentication for public endpoints
    if (request.nextUrl.pathname === '/api/users/login' ||
        request.nextUrl.pathname === '/api/users/register') {
      return NextResponse.next()
    }
    
    // Check if user is authenticated
    const user = authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check role-based access for admin routes
    if (request.nextUrl.pathname.startsWith('/api/admin') && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*'
  ]
}
