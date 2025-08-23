import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// Moves all staging rules to production (replace-all strategy)
export async function POST() {
  try {
    const staging = await prisma.taxQuickRuleStaging.findMany()
    // Clear production and re-insert
    await prisma.$transaction([
      prisma.taxQuickRuleProduction.deleteMany(),
      ...staging.map((s) => prisma.taxQuickRuleProduction.create({ data: {
        description: s.description,
        ratePercent: s.ratePercent,
        isInclusive: s.isInclusive,
        isGST: s.isGST,
      }}))
    ])
    return NextResponse.json({ success: true, count: staging.length })
  } catch (error) {
    console.error('Publish tax rules failed:', error)
    return NextResponse.json({ success: false, error: 'Failed to publish' }, { status: 500 })
  }
}

