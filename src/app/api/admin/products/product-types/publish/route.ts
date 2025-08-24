import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import { NextRequest } from "next/server";

// POST /api/admin/products/product-types/publish
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all staging product types
    const stagingProductTypes = await prisma.productTypeStaging.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" }
      ]
    });

    let publishedCount = 0;

    // Process each staging product type
    for (const stagingType of stagingProductTypes) {
      if (stagingType.isDeleted) {
        // Delete from production if it exists
        await prisma.productType.deleteMany({
          where: { id: stagingType.id }
        });
      } else {
        // Check if this product type already exists in production
        const existingProductionType = await prisma.productType.findUnique({
          where: { id: stagingType.id }
        });

        if (existingProductionType) {
          // Update existing production product type
          await prisma.productType.update({
            where: { id: stagingType.id },
            data: {
              name: stagingType.name,
              slug: stagingType.slug,
              description: stagingType.description,
              productCategoryId: stagingType.productCategoryId,
              isActive: stagingType.isActive,
              sortOrder: stagingType.sortOrder,
              updatedAt: new Date()
            }
          });
        } else {
          // Create new production product type
          await prisma.productType.create({
            data: {
              id: stagingType.id,
              name: stagingType.name,
              slug: stagingType.slug,
              description: stagingType.description,
              productCategoryId: stagingType.productCategoryId,
              isActive: stagingType.isActive,
              sortOrder: stagingType.sortOrder
            }
          });
        }
        publishedCount++;
      }
    }

    // Clear all staging data
    await prisma.productTypeStaging.deleteMany({});

    return NextResponse.json({
      success: true,
      publishedCount,
      message: `Successfully published ${publishedCount} product types to production`
    });
  } catch (error) {
    console.error("Failed to publish product types to production:", error);
    return NextResponse.json(
      { error: "Failed to publish product types to production" },
      { status: 500 }
    );
  }
}
