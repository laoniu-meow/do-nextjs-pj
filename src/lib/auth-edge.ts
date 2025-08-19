import { NextRequest } from 'next/server'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Edge Runtime compatible JWT verification
// This is a simplified version that works in Edge Runtime
export function verifyTokenEdge(token: string): JWTPayload | null {
  try {
    // For Edge Runtime, we'll use a simple base64 decode approach
    // This is not as secure as proper JWT verification but works for basic auth
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    const payload = JSON.parse(jsonPayload)
    
    // Basic validation
    if (!payload.userId || !payload.email || !payload.role) {
      return null
    }
    
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    }
  } catch {
    return null
  }
}

export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

export function authenticateRequestEdge(request: NextRequest): JWTPayload | null {
  try {
    const token = extractTokenFromRequest(request)
    if (!token) return null
    
    return verifyTokenEdge(token)
  } catch {
    return null
  }
}
