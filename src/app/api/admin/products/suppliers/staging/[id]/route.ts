import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/products/suppliers/staging/[id] - get specific staging supplier
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const supplier = await prisma.supplierStaging.findUnique({
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
        { success: false, error: 'Staging supplier not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      supplier 
    });
  } catch (error) {
    console.error('Error loading staging supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load staging supplier' }, 
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/suppliers/staging/[id] - update staging supplier (full update)
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

    // Check if code already exists for another staging supplier (excluding current one)
    const existingStagingSupplier = await prisma.supplierStaging.findFirst({
      where: { 
        code, 
        id: { not: id } 
      },
    });

    if (existingStagingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier code already exists in staging' }, 
        { status: 400 }
      );
    }

    // For staging, we don't need to check production conflicts since this is just staging data
    // The production check will happen when uploading to production

    // Update staging supplier
    const supplier = await prisma.supplierStaging.update({
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
      message: 'Staging supplier updated successfully' 
    });
  } catch (error) {
    console.error('Error updating staging supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staging supplier' }, 
      { status: 500 }
    );
  }
}

// PATCH /api/admin/products/suppliers/staging/[id] - partial update staging supplier
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Update staging supplier with partial data
    const supplier = await prisma.supplierStaging.update({
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
      message: 'Staging supplier updated successfully' 
    });
  } catch (error) {
    console.error('Error updating staging supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staging supplier' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/suppliers/staging/[id] - delete staging supplier
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if the supplier exists before trying to delete
    const existingSupplier = await prisma.supplierStaging.findUnique({
      where: { id }
    });

    if (!existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Staging supplier not found' },
        { status: 404 }
      );
    }

    await prisma.supplierStaging.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Staging supplier deleted successfully' 
    });
  } catch (error: unknown) {
    console.error('Error deleting staging supplier:', error);
    
    // Handle Prisma record not found error specifically
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { success: false, error: 'Staging supplier not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete staging supplier' }, 
      { status: 500 }
    );
  }
}
