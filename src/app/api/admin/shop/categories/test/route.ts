import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/shop/categories/test - test Prisma client
export async function GET() {
  try {
    // Test basic Prisma client functionality
    console.warn('Testing Prisma client...');
    console.warn('Prisma client:', typeof prisma);
    console.warn('CategoryStaging available:', !!prisma.categoryStaging);
    
    if (!prisma || !prisma.categoryStaging) {
      return NextResponse.json({
        success: false,
        error: 'Prisma client not properly initialized',
        details: {
          prismaType: typeof prisma,
          hasCategoryStaging: !!prisma?.categoryStaging,
        }
      }, { status: 500 });
    }

    // Test database connection
    const count = await prisma.categoryStaging.count();
    
    return NextResponse.json({
      success: true,
      message: 'Prisma client working correctly',
      details: {
        prismaType: typeof prisma,
        hasCategoryStaging: !!prisma.categoryStaging,
        stagingCount: count,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}
