import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const data = await prisma.taxQuickRuleStaging.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Load staging tax rules failed:', error)
    return NextResponse.json({ success: false, error: 'Failed to load' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const created = await prisma.taxQuickRuleStaging.create({ data: {
      description: body.description ?? null,
      ratePercent: body.ratePercent, // expect number or string, Prisma will coerce
      isInclusive: Boolean(body.isInclusive),
      isGST: Boolean(body.isGST),
    }})
    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error('Create staging tax rule failed:', error)
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 })
  }
}

// Replace-all (bulk upsert) for staging rules
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const rules = Array.isArray(body?.rules) ? body.rules : []
    await prisma.$transaction([
      prisma.taxQuickRuleStaging.deleteMany(),
      ...rules.map((r: { description?: string | null; ratePercent: number; isInclusive: boolean; isGST: boolean }) =>
        prisma.taxQuickRuleStaging.create({
          data: {
            description: r.description ?? null,
            ratePercent: r.ratePercent,
            isInclusive: Boolean(r.isInclusive),
            isGST: Boolean(r.isGST),
          },
        })
      ),
    ])
    return NextResponse.json({ success: true, count: rules.length })
  } catch (error) {
    console.error('Bulk save staging tax rules failed:', error)
    return NextResponse.json({ success: false, error: 'Failed to save staging' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (id) {
      await prisma.taxQuickRuleStaging.delete({ where: { id } })
    } else {
      await prisma.taxQuickRuleStaging.deleteMany()
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete staging tax rule failed:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}

