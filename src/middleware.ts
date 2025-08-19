import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authRateLimiter, apiRateLimiter } from './lib/rate-limit'
import { authenticateRequestEdge } from './lib/auth-edge'

export function middleware(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  // Rate limiting for authentication endpoints
  if (request.nextUrl.pathname === '/api/users/login' || 
      request.nextUrl.pathname === '/api/users/register') {
    if (!authRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many authentication attempts. Please try again later.',
          retryAfter: Math.ceil(authRateLimiter.getResetTime(clientIP) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': authRateLimiter.getRemaining(clientIP).toString(),
            'X-RateLimit-Reset': authRateLimiter.getResetTime(clientIP).toString(),
            'Retry-After': Math.ceil(authRateLimiter.getResetTime(clientIP) / 1000).toString()
          }
        }
      )
    }
  }

  // General API rate limiting
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!apiRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(apiRateLimiter.getResetTime(clientIP) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': apiRateLimiter.getRemaining(clientIP).toString(),
            'X-RateLimit-Reset': apiRateLimiter.getResetTime(clientIP).toString(),
            'Retry-After': Math.ceil(apiRateLimiter.getResetTime(clientIP) / 1000).toString()
          }
        }
      )
    }
  }

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
    
    // Check if user is authenticated using Edge Runtime compatible function
    const user = authenticateRequestEdge(request)
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
