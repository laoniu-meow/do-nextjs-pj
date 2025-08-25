import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { Decimal } from '@prisma/client/runtime/library'

export const runtime = 'nodejs'

// GET: Return current donations
export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { campaignName: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: {
        donations,
      },
      message: 'Donations retrieved successfully',
    })
  } catch (error) {
    console.error('Error loading donations:', error)
    return NextResponse.json({ success: false, error: 'Failed to load donations' }, { status: 500 })
  }
}

type IncomingDonation = {
  description: string
  amount: number
  campaignName: string
  startDateTime: string
  endDateTime: string
  isOneTime: boolean
  notes?: string | null
  isActive: boolean
}

// POST: Create or update donations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { donations, replace = true } = body as {
      donations?: IncomingDonation[]
      replace?: boolean
    }

    if (!Array.isArray(donations)) {
      return NextResponse.json({ success: false, error: 'Donations array is required' }, { status: 400 })
    }

    const applied = await prisma.$transaction(async (tx) => {
      if (replace) {
        await tx.donation.deleteMany({})
      }

      const createdDonations = []
      for (const donation of donations) {
        const created = await tx.donation.create({
          data: {
            description: donation.description,
            amount: new Decimal(donation.amount),
            campaignName: donation.campaignName,
            startDateTime: donation.startDateTime ? new Date(donation.startDateTime) : new Date(),
            endDateTime: donation.endDateTime ? new Date(donation.endDateTime) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isOneTime: donation.isOneTime,
            notes: donation.notes,
            isActive: donation.isActive,
          },
        })
        createdDonations.push(created)
      }

      return { donations: createdDonations }
    })

    return NextResponse.json({ success: true, data: applied, message: 'Donations saved successfully' })
  } catch (error) {
    console.error('Error saving donations:', error)
    return NextResponse.json({ success: false, error: 'Failed to save donations' }, { status: 500 })
  }
}

// DELETE: Clear all donations
export async function DELETE() {
  try {
    const result = await prisma.donation.deleteMany({})
    return NextResponse.json({ 
      success: true, 
      count: result.count, 
      message: 'All donations cleared' 
    })
  } catch (error) {
    console.error('Error clearing donations:', error)
    return NextResponse.json({ success: false, error: 'Failed to clear donations' }, { status: 500 })
  }
}
