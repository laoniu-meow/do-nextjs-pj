import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = 'nodejs';

// GET /api/shop/suppliers/production - get production suppliers
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
      data: suppliers,
    });
  } catch (error) {
    console.error('Error loading production suppliers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load production suppliers' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {

    // Fetch all staging suppliers
    const stagingSuppliers = await prisma.supplierStaging.findMany();

    if (stagingSuppliers.length === 0) {
      return NextResponse.json(
        { error: "No staging suppliers found" },
        { status: 400 }
      );
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Clear all production suppliers
      await tx.supplier.deleteMany();

      // Create new production suppliers from staging
      const createdSuppliers = await tx.supplier.createMany({
        data: stagingSuppliers.map((supplier) => ({
          name: supplier.name,
          code: supplier.code,
          email: supplier.email,
          phone: supplier.phone,
          notes: supplier.notes,
          isActive: supplier.isActive,
        })),
      });

      // Clear staging table
      await tx.supplierStaging.deleteMany();

      return createdSuppliers;
    });

    return NextResponse.json({
      success: true,
      message: "Suppliers moved from staging to production",
      count: result.count,
    });
  } catch (error) {
    console.error("Error moving suppliers to production:", error);
    return NextResponse.json(
      { error: "Failed to move suppliers to production" },
      { status: 500 }
    );
  }
}
