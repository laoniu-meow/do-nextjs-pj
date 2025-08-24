import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// POST /api/admin/shop/suppliers/bulk-upload - move staging suppliers to production
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { suppliers } = body;

    if (!Array.isArray(suppliers) || suppliers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Suppliers array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate required fields for each supplier
    for (const supplier of suppliers) {
      if (!supplier.name || !supplier.code) {
        return NextResponse.json(
          { success: false, error: 'Name and code are required for all suppliers' },
          { status: 400 }
        );
      }
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      const createdSuppliers = [];

      for (const supplier of suppliers) {
        // Check if code already exists in production
        const existingSupplier = await tx.supplier.findUnique({
          where: { code: supplier.code },
        });

        if (existingSupplier) {
          throw new Error(`Supplier code '${supplier.code}' already exists in production`);
        }

        // Create supplier in production
        const createdSupplier = await tx.supplier.create({
          data: {
            name: supplier.name,
            code: supplier.code,
            email: supplier.email || null,
            phone: supplier.phone || null,
            notes: supplier.notes || null,
            isActive: supplier.isActive !== undefined ? supplier.isActive : true,
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

        createdSuppliers.push(createdSupplier);
      }

      return createdSuppliers;
    });

    return NextResponse.json({
      success: true,
      suppliers: result,
      message: `${result.length} supplier(s) uploaded to production successfully`,
    });
  } catch (error) {
    console.error('Error uploading suppliers to production:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to upload suppliers to production' },
      { status: 500 }
    );
  }
}
