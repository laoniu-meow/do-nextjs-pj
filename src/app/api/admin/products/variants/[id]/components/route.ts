import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// GET components of a bundle variant
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await prisma.productBundleComponent.findMany({
      where: { bundleVariantId: id },
      select: {
        componentVariantId: true,
        quantity: true,
        component: { select: { sku: true, product: { select: { title: true } } } },
      },
      orderBy: { componentVariantId: 'asc' },
    })
    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    console.error('Error getting bundle components:', error)
    return NextResponse.json({ success: false, error: 'Failed to get bundle components' }, { status: 500 })
  }
}

// POST replace components list
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { components } = body as { components: Array<{ componentVariantId: string; quantity: number }> }
    if (!Array.isArray(components)) {
      return NextResponse.json({ success: false, error: 'components[] is required' }, { status: 400 })
    }
    await prisma.$transaction([
      prisma.productBundleComponent.deleteMany({ where: { bundleVariantId: id } }),
      prisma.productBundleComponent.createMany({
        data: components.map(c => ({ bundleVariantId: id, componentVariantId: c.componentVariantId, quantity: Math.max(1, Number(c.quantity || 1)) })),
        skipDuplicates: true,
      }),
    ])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving bundle components:', error)
    return NextResponse.json({ success: false, error: 'Failed to save bundle components' }, { status: 500 })
  }
}


