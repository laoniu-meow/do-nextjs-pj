import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Fetch all staging suppliers
    const stagingSuppliers = await prisma.supplierStaging.findMany();

    if (stagingSuppliers.length === 0) {
      // If no staging data, clear production data (this handles deletions)
      await prisma.supplier.deleteMany({});
      return NextResponse.json({
        success: true,
        message: "Production suppliers cleared (no staging data to upload)",
        count: 0,
      });
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
      await tx.supplierStaging.deleteMany({});

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
