import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// PATCH /api/admin/shop/promotions/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = await prisma.promotion.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        code: body.code ?? undefined,
        type: body.type ?? undefined,
        value: body.value ?? undefined,
        isActive: body.isActive ?? undefined,
        startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
        endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
        allowStacking: body.allowStacking ?? undefined,
        stackingPriority: body.stackingPriority ?? undefined,
        maxUses: body.maxUses ?? undefined,
        maxUsesPerUser: body.maxUsesPerUser ?? undefined,
      },
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json({ success: false, error: 'Failed to update promotion' }, { status: 500 })
  }
}

// DELETE /api/admin/shop/promotions/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.promotion.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete promotion' }, { status: 500 })
  }
}


