import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

// GET /api/admin/users - Get all users (admin only)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(successResponse(users))
  } catch (error) {
    logger.logApiError('/api/admin/users', error)
    return NextResponse.json(
      errorResponse('Failed to fetch users'),
      { status: 500 }
    )
  }
}
