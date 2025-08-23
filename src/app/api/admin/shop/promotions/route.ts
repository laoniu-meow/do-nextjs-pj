import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// GET /api/admin/shop/promotions - list all promotions
export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, data: promotions })
  } catch (error) {
    console.error('Error listing promotions:', error)
    return NextResponse.json({ success: false, error: 'Failed to list promotions' }, { status: 500 })
  }
}

// POST /api/admin/shop/promotions - create promotion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      code,
      type,
      value,
      isActive = true,
      startsAt,
      endsAt,
      allowStacking = true,
      stackingPriority = 0,
      maxUses,
      maxUsesPerUser,
    } = body || {}

    if (!name || !type || value === undefined) {
      return NextResponse.json({ success: false, error: 'name, type, and value are required' }, { status: 400 })
    }

    const created = await prisma.promotion.create({
      data: {
        name,
        code: code || null,
        type,
        value,
        isActive: Boolean(isActive),
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        allowStacking: Boolean(allowStacking),
        stackingPriority: Number(stackingPriority || 0),
        maxUses: maxUses ? Number(maxUses) : null,
        maxUsesPerUser: maxUsesPerUser ? Number(maxUsesPerUser) : null,
      },
    })

    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error('Error creating promotion:', error)
    const message = (error as Error)?.message?.includes('Unique constraint') ? 'Promotion code already exists' : 'Failed to create promotion'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}


