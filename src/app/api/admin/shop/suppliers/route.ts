import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/shop/suppliers - list all suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true,
        notes: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      suppliers 
    });
  } catch (error) {
    console.error('Error loading suppliers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load suppliers' }, 
      { status: 500 }
    );
  }
}

// POST /api/admin/shop/suppliers - create new supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, email, phone, notes, isActive } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'Name and code are required' }, 
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { code },
    });

    if (existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier code already exists' }, 
        { status: 400 }
      );
    }

    // Create new supplier
    const supplier = await prisma.supplier.create({
      data: {
        name,
        code,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true,
        notes: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      supplier,
      message: 'Supplier created successfully' 
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create supplier' }, 
      { status: 500 }
    );
  }
}
