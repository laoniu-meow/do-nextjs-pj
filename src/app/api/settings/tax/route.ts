import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// GET: Return current tax settings snapshot for visualization
export async function GET() {
  try {
    const [settings, classes, rules] = await Promise.all([
      prisma.taxSettings.findFirst().catch(() => null),
      prisma.taxClass.findMany({ orderBy: { name: 'asc' } }).catch(() => []),
      prisma.taxRule.findMany({ orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }] }).catch(() => []),
    ])

    return NextResponse.json({
      success: true,
      data: {
        settings: settings ?? null,
        classes,
        rules,
      },
      message: 'Tax configuration retrieved',
    })
  } catch (error) {
    console.error('Error loading tax settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to load tax settings' }, { status: 500 })
  }
}

type IncomingSettings = {
  priceIncludesTax?: boolean
  roundingStrategy?: 'LINE' | 'TOTAL'
  defaultPriceMode?: 'INCLUSIVE' | 'EXCLUSIVE'
  defaultTaxClassCode?: string | null
  shippingTaxClassCode?: string | null
}

type IncomingClass = { name: string; code: string; description?: string | null; isDefault?: boolean }
type IncomingRule = { name?: string | null; taxClassCode: string; percentage: string; priority?: number; isCompound?: boolean }

// POST: Replace tax config or seed SG basic configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { seed, replace = true } = body as { seed?: 'SG_BASIC'; replace?: boolean }

    if (seed === 'SG_BASIC') {
      const result = await prisma.$transaction(async (tx) => {
        // Clear existing
        await tx.taxRule.deleteMany({})
        await tx.taxClass.deleteMany({})
        await tx.taxSettings.deleteMany({})

        const std = await tx.taxClass.create({
          data: { name: 'Standard GST', code: 'SG_STD', description: 'Singapore standard GST', isDefault: true },
        })
        await tx.taxRule.create({
          data: {
            name: 'SG GST 9%',
            classId: std.id,
            percentage: '0.0900',
            priority: 0,
            isCompound: false,
          },
        })

        const settings = await tx.taxSettings.create({
          data: {
            priceIncludesTax: false,
            roundingStrategy: 'LINE',
            defaultPriceMode: 'EXCLUSIVE',
            defaultTaxClassId: std.id,
          },
        })

        return { settings, classes: [std], rules: await tx.taxRule.findMany() }
      })

      return NextResponse.json({ success: true, data: result, message: 'Seeded SG basic GST configuration' })
    }

    // Replace or upsert provided payload
    const { settings, classes, rules } = body as {
      settings?: IncomingSettings
      classes?: IncomingClass[]
      rules?: IncomingRule[]
    }

    const applied = await prisma.$transaction(async (tx) => {
      if (replace) {
        await tx.taxRule.deleteMany({})
        await tx.taxClass.deleteMany({})
        // Keep settings row if present; we may update it below
      }

      const classMap = new Map<string, string>() // code -> id
      if (Array.isArray(classes)) {
        for (const c of classes) {
          const up = await tx.taxClass.upsert({
            where: { code: c.code },
            update: { name: c.name, description: c.description ?? null, isDefault: !!c.isDefault },
            create: { name: c.name, code: c.code, description: c.description ?? null, isDefault: !!c.isDefault },
          })
          classMap.set(up.code, up.id)
        }
      }

      if (Array.isArray(rules)) {
        for (const r of rules) {
          const classId = classMap.get(r.taxClassCode)
          if (!classId) continue
          await tx.taxRule.create({
            data: {
              name: r.name ?? null,
              classId,
              percentage: r.percentage,
              priority: r.priority ?? 0,
              isCompound: !!r.isCompound,
              // optional inline inclusive flag
              isInclusive: (r as { isInclusive?: boolean }).isInclusive ?? false,
            },
          })
        }
      }

      if (settings) {
        let defaultTaxClassId: string | null = null
        let shippingTaxClassId: string | null = null
        if (settings.defaultTaxClassCode) {
          const cls = await tx.taxClass.findUnique({ where: { code: settings.defaultTaxClassCode } })
          defaultTaxClassId = cls?.id ?? null
        }
        if (settings.shippingTaxClassCode) {
          const cls = await tx.taxClass.findUnique({ where: { code: settings.shippingTaxClassCode } })
          shippingTaxClassId = cls?.id ?? null
        }

        const existing = await tx.taxSettings.findFirst()
        if (existing) {
          await tx.taxSettings.update({
            where: { id: existing.id },
            data: {
              priceIncludesTax: settings.priceIncludesTax ?? existing.priceIncludesTax,
              roundingStrategy: (settings.roundingStrategy as 'LINE' | 'TOTAL') ?? existing.roundingStrategy,
              defaultPriceMode: (settings.defaultPriceMode as 'INCLUSIVE' | 'EXCLUSIVE') ?? existing.defaultPriceMode,
              defaultTaxClassId,
              shippingTaxClassId,
            },
          })
        } else {
          await tx.taxSettings.create({
            data: {
              priceIncludesTax: settings.priceIncludesTax ?? false,
              roundingStrategy: (settings.roundingStrategy as 'LINE' | 'TOTAL') ?? 'LINE',
              defaultPriceMode: (settings.defaultPriceMode as 'INCLUSIVE' | 'EXCLUSIVE') ?? 'EXCLUSIVE',
              defaultTaxClassId,
              shippingTaxClassId,
            },
          })
        }
      }

      const [outSettings, outClasses, outRules] = await Promise.all([
        tx.taxSettings.findFirst(),
        tx.taxClass.findMany(),
        tx.taxRule.findMany({ orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }] }),
      ])

      return { settings: outSettings, classes: outClasses, rules: outRules }
    })

    return NextResponse.json({ success: true, data: applied, message: 'Tax configuration applied' })
  } catch (error) {
    console.error('Error saving tax settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to save tax settings' }, { status: 500 })
  }
}

// DELETE: Clear all tax settings/classes/zones/rules (for quick resets during visualization)
export async function DELETE() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const rules = await tx.taxRule.deleteMany({})
      const classes = await tx.taxClass.deleteMany({})
      const settings = await tx.taxSettings.deleteMany({})
      return { rules: rules.count, classes: classes.count, settings: settings.count }
    })
    return NextResponse.json({ success: true, ...result, message: 'Tax configuration cleared' })
  } catch (error) {
    console.error('Error clearing tax settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to clear tax settings' }, { status: 500 })
  }
}


