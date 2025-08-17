import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json(
      successResponse({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected'
      })
    )
  } catch (error) {
    logger.logApiError('/api/health', error)
    return NextResponse.json(
      errorResponse('Service unhealthy'),
      { status: 503 }
    )
  }
}
