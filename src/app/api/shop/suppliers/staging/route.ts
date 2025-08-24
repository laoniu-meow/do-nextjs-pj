import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = 'nodejs';

export async function GET() {
  try {
    const stagingSuppliers = await prisma.supplierStaging.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: stagingSuppliers,
    });
  } catch (error) {
    console.error("Error fetching staging suppliers:", error);
    return NextResponse.json(
      { error: "Failed to fetch staging suppliers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { suppliers } = await request.json();

    if (!Array.isArray(suppliers)) {
      return NextResponse.json(
        { error: "Invalid suppliers data" },
        { status: 400 }
      );
    }

    // Clear existing staging records
    await prisma.supplierStaging.deleteMany();

    // Create new staging records
    const createdSuppliers = await prisma.supplierStaging.createMany({
      data: suppliers.map((supplier: { name: string; code: string; email?: string; phone?: string; notes?: string; isActive: boolean }) => ({
        name: supplier.name,
        code: supplier.code,
        email: supplier.email,
        phone: supplier.phone,
        notes: supplier.notes,
        isActive: supplier.isActive,
      })),
    });

    return NextResponse.json({
      success: true,
      message: "Suppliers saved to staging",
      count: createdSuppliers.count,
    });
  } catch (error) {
    console.error("Error saving suppliers to staging:", error);
    return NextResponse.json(
      { error: "Failed to save suppliers to staging" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a specific supplier from staging
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Supplier ID is required' },
        { status: 400 }
      );
    }

    // Check if the supplier exists
    const existingSupplier = await prisma.supplierStaging.findUnique({
      where: { id }
    });

    if (!existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      );
    }

    // Delete the supplier
    await prisma.supplierStaging.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Supplier removed from staging successfully',
    });
  } catch (error) {
    console.error('Error removing supplier from staging:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove supplier from staging' },
      { status: 500 }
    );
  }
}
