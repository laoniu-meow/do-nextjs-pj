import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/health/prisma - check Prisma client health
export async function GET() {
  try {
    // Test basic Prisma client functionality
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({
      success: true,
      message: 'Prisma client is healthy',
      data: {
        test: result,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Prisma health check failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Prisma client health check failed',
      details: {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}
