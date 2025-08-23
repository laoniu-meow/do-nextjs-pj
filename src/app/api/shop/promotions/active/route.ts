import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// GET /api/shop/promotions/active - list currently active promotions (public)
export async function GET() {
  try {
    const now = new Date()
    const promos = await prisma.promotion.findMany({
      where: {
        isActive: true,
        OR: [
          { startsAt: null, endsAt: null },
          { startsAt: { lte: now }, endsAt: null },
          { startsAt: null, endsAt: { gte: now } },
          { startsAt: { lte: now }, endsAt: { gte: now } },
        ],
      },
      orderBy: [{ stackingPriority: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ success: true, data: promos })
  } catch (error) {
    console.error('Error loading active promotions:', error)
    return NextResponse.json({ success: false, error: 'Failed to load active promotions' }, { status: 500 })
  }
}


