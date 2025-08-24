import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/products/suppliers/[id] - get specific supplier
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const supplier = await prisma.supplier.findUnique({
      where: { id },
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

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      supplier 
    });
  } catch (error) {
    console.error('Error loading supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load supplier' }, 
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/suppliers/[id] - update supplier (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, code, email, phone, notes, isActive } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'Name and code are required' }, 
        { status: 400 }
      );
    }

    // Check if code already exists for another supplier
    const existingSupplier = await prisma.supplier.findFirst({
      where: { 
        code, 
        id: { not: id } 
      },
    });

    if (existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier code already exists' }, 
        { status: 400 }
      );
    }

    // Update supplier
    const supplier = await prisma.supplier.update({
      where: { id },
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
      message: 'Supplier updated successfully' 
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update supplier' }, 
      { status: 500 }
    );
  }
}

// PATCH /api/admin/products/suppliers/[id] - partial update supplier
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update supplier with only provided fields
    const supplier = await prisma.supplier.update({
      where: { id },
      data: body,
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
      message: 'Supplier updated successfully' 
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update supplier' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/suppliers/[id] - delete supplier
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if supplier is referenced by any variants
    const variantSuppliers = await prisma.variantSupplier.findMany({
      where: { supplierId: id },
    });

    if (variantSuppliers.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete supplier. It is referenced by product variants.' 
        }, 
        { status: 400 }
      );
    }

    // Delete supplier
    await prisma.supplier.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Supplier deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete supplier' }, 
      { status: 500 }
    );
  }
}
