import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyTokenEdge } from '@/lib/auth-edge'
import { successResponse, errorResponse } from '@/lib/api-response'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        errorResponse('No token provided'),
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify the JWT token
    const payload = await verifyTokenEdge(token)
    if (!payload) {
      return NextResponse.json(
        errorResponse('Invalid token'),
        { status: 401 }
      )
    }

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 401 }
      )
    }

    return NextResponse.json(
      successResponse({
        user,
        token
      }, 'Token verified successfully')
    )

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      errorResponse('Token verification failed'),
      { status: 401 }
    )
  }
}
