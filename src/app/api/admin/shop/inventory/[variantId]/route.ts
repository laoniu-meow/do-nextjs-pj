import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// PATCH /api/admin/shop/inventory/[variantId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  try {
    const { variantId } = await params
    const body = await request.json()
    const { stockOnHand, reserved, lowStockThreshold, backorderPolicy } = body || {}
    const updated = await prisma.inventoryItem.upsert({
      where: { variantId },
      create: {
        variantId,
        stockOnHand: Number(stockOnHand ?? 0),
        reserved: Number(reserved ?? 0),
        lowStockThreshold: Number(lowStockThreshold ?? 0),
        backorderPolicy: backorderPolicy ?? 'NONE',
      },
      update: {
        stockOnHand: stockOnHand === undefined ? undefined : Number(stockOnHand),
        reserved: reserved === undefined ? undefined : Number(reserved),
        lowStockThreshold: lowStockThreshold === undefined ? undefined : Number(lowStockThreshold),
        backorderPolicy: backorderPolicy === undefined ? undefined : backorderPolicy,
      },
      select: { variantId: true, stockOnHand: true, reserved: true, lowStockThreshold: true, backorderPolicy: true },
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json({ success: false, error: 'Failed to update inventory' }, { status: 500 })
  }
}


