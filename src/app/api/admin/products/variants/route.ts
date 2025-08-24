import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// GET /api/admin/products/variants - list variants with inventory
export async function GET() {
  try {
    const data = await prisma.productVariant.findMany({
      select: {
        id: true,
        productId: true,
        product: { select: { title: true } },
        sku: true,
        attributes: true,
        price: true,
        compareAtPrice: true,
        isActive: true,
        kind: true,
        inventory: {
          select: { stockOnHand: true, reserved: true, lowStockThreshold: true, backorderPolicy: true }
        },
        _count: { select: { bundleComponents: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    const mapped = data.map(v => ({
      id: v.id,
      productId: v.productId,
      productTitle: v.product?.title ?? null,
      sku: v.sku,
      attributes: v.attributes as Record<string, unknown>,
      price: String(v.price),
      compareAtPrice: v.compareAtPrice ? String(v.compareAtPrice) : null,
      isActive: v.isActive,
      kind: v.kind,
      componentsCount: v._count?.bundleComponents ?? 0,
      stockOnHand: v.inventory?.stockOnHand ?? 0,
      reserved: v.inventory?.reserved ?? 0,
      lowStockThreshold: v.inventory?.lowStockThreshold ?? 0,
      backorderPolicy: (v.inventory?.backorderPolicy as string) ?? 'NONE',
    }))
    return NextResponse.json({ success: true, data: mapped })
  } catch (error) {
    console.error('Error loading variants:', error)
    return NextResponse.json({ success: false, error: 'Failed to load variants' }, { status: 500 })
  }
}

// POST /api/admin/products/variants - create variant (inventory row optional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, sku, attributes, price, compareAtPrice, isActive = true } = body || {}
    if (!productId || !sku || price === undefined) {
      return NextResponse.json({ success: false, error: 'productId, sku, price are required' }, { status: 400 })
    }
    const created = await prisma.productVariant.create({
      data: {
        productId,
        sku,
        attributes: attributes ?? {},
        price,
        compareAtPrice: compareAtPrice ?? null,
        isActive: Boolean(isActive),
      },
      select: { id: true }
    })
    // Ensure inventory row exists
    await prisma.inventoryItem.upsert({
      where: { variantId: created.id },
      create: { variantId: created.id },
      update: {},
    })
    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error('Error creating variant:', error)
    return NextResponse.json({ success: false, error: 'Failed to create variant' }, { status: 500 })
  }
}


