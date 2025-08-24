import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = 'nodejs';

// POST /api/admin/shop/suppliers/publish - publish staging suppliers to production
export async function POST() {
  try {
    // Fetch all staging suppliers
    const stagingSuppliers = await prisma.supplierStaging.findMany();

    console.warn('Publishing suppliers to production - found staging suppliers:', stagingSuppliers.length);

    // Filter to only publish non-deleted suppliers (isDeleted: false)
    const activeSuppliers = stagingSuppliers.filter(supplier => !supplier.isDeleted);
    
    console.warn('Active suppliers to publish:', activeSuppliers.length);

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Clear all production suppliers
      await tx.supplier.deleteMany();

      // Only create production suppliers from active staging suppliers (not deleted ones)
      let createdSuppliers = { count: 0 };
      if (activeSuppliers.length > 0) {
        createdSuppliers = await tx.supplier.createMany({
          data: activeSuppliers.map((supplier) => ({
            name: supplier.name,
            code: supplier.code,
            email: supplier.email,
            phone: supplier.phone,
            notes: supplier.notes,
            isActive: supplier.isActive,
          })),
        });
      }

      // Clear staging table (both active and deleted)
      await tx.supplierStaging.deleteMany({});

      return createdSuppliers;
    });

    return NextResponse.json({
      success: true,
      message: `Successfully published ${result.count} suppliers to production`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error publishing suppliers to production:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish suppliers to production" },
      { status: 500 }
    );
  }
}

