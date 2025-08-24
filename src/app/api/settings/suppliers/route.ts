import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

// GET: Return current suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: {
        suppliers,
      },
      message: 'Suppliers retrieved successfully',
    })
  } catch (error) {
    console.error('Error loading suppliers:', error)
    return NextResponse.json({ success: false, error: 'Failed to load suppliers' }, { status: 500 })
  }
}

type IncomingSupplier = {
  name: string
  code: string
  isActive: boolean
  email?: string | null
  phone?: string | null
  notes?: string | null
}

// POST: Create or update suppliers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { suppliers, replace = true } = body as {
      suppliers?: IncomingSupplier[]
      replace?: boolean
    }

    if (!Array.isArray(suppliers)) {
      return NextResponse.json({ success: false, error: 'Suppliers array is required' }, { status: 400 })
    }

    const applied = await prisma.$transaction(async (tx) => {
      if (replace) {
        await tx.supplier.deleteMany({})
      }

      const createdSuppliers = []
      for (const supplier of suppliers) {
        const created = await tx.supplier.create({
          data: {
            name: supplier.name,
            code: supplier.code,
            isActive: supplier.isActive,
            email: supplier.email,
            phone: supplier.phone,
            notes: supplier.notes,
          },
        })
        createdSuppliers.push(created)
      }

      return { suppliers: createdSuppliers }
    })

    return NextResponse.json({ success: true, data: applied, message: 'Suppliers saved successfully' })
  } catch (error) {
    console.error('Error saving suppliers:', error)
    return NextResponse.json({ success: false, error: 'Failed to save suppliers' }, { status: 500 })
  }
}

// DELETE: Clear all suppliers
export async function DELETE() {
  try {
    const result = await prisma.supplier.deleteMany({})
    return NextResponse.json({ 
      success: true, 
      count: result.count, 
      message: 'All suppliers cleared' 
    })
  } catch (error) {
    console.error('Error clearing suppliers:', error)
    return NextResponse.json({ success: false, error: 'Failed to clear suppliers' }, { status: 500 })
  }
}
