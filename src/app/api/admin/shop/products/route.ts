import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateUniqueSlug } from '@/lib/slug'

export const runtime = 'nodejs'

// POST /api/admin/shop/products - create product with server-side slug generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, brandId, status } = body || {}
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }

    const slug = await generateUniqueSlug(title, async (candidate) => {
      const existing = await prisma.product.findUnique({ where: { slug: candidate } })
      return Boolean(existing)
    })

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description ?? null,
        brandId: brandId ?? null,
        status: status ?? 'DRAFT',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}


