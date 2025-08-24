import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/shop/suppliers/staging - list all staging suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplierStaging.findMany({
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
    console.error('Error loading staging suppliers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load staging suppliers' }, 
      { status: 500 }
    );
  }
}

// POST /api/admin/shop/suppliers/staging - create new staging supplier OR bulk save
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a bulk save operation (like tax settings)
    if (body.suppliers && Array.isArray(body.suppliers)) {
      // Bulk save to staging (clear existing and create new)
      await prisma.supplierStaging.deleteMany({});

      const savedSuppliers = [];
      for (const supplier of body.suppliers) {
        const savedSupplier = await prisma.supplierStaging.create({
          data: {
            name: supplier.name,
            code: supplier.code,
            email: supplier.email || null,
            phone: supplier.phone || null,
            notes: supplier.notes || null,
            isActive: supplier.isActive !== undefined ? supplier.isActive : true,
          },
        });
        savedSuppliers.push(savedSupplier);
      }

      return NextResponse.json({
        success: true,
        suppliers: savedSuppliers,
        message: 'Suppliers saved to staging successfully',
      });
    }

    // Individual supplier creation (existing logic)
    const { name, code, email, phone, notes, isActive } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'Name and code are required' }, 
        { status: 400 }
      );
    }

    // Check if code already exists in staging
    const existingStagingSupplier = await prisma.supplierStaging.findUnique({
      where: { code },
    });

    if (existingStagingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier code already exists in staging' }, 
        { status: 400 }
      );
    }

    // Create new staging supplier
    const supplier = await prisma.supplierStaging.create({
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
      message: 'Staging supplier created successfully' 
    });
  } catch (error) {
    console.error('Error creating staging supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staging supplier' }, 
      { status: 500 }
    );
  }
}
