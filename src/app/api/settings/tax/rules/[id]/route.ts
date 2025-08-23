import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.taxRule.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tax rule:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete tax rule' }, { status: 500 })
  }
}


