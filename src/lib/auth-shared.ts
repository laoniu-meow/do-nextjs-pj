import { NextRequest } from 'next/server'

// Shared auth types and helpers that are safe for both Node and Edge runtimes

export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}


