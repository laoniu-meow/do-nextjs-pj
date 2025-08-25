import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

// POST /api/admin/products/publish - publish staging products to production
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all staging products
    const stagingProducts = await prisma.productStaging.findMany({
      include: {
        productType: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
      orderBy: [
        { createdAt: "asc" }
      ]
    });

    let publishedCount = 0;

    // Process each staging product
    for (const stagingProduct of stagingProducts) {
      if (stagingProduct.isDeleted) {
        // Delete from production if it exists
        await prisma.product.deleteMany({
          where: { id: stagingProduct.id }
        });
      } else {
        // Check if this product already exists in production
        const existingProduct = await prisma.product.findUnique({
          where: { id: stagingProduct.id }
        });

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: stagingProduct.id },
            data: {
              productCode: stagingProduct.productCode,
              productName: stagingProduct.productName,
              description: stagingProduct.description,
              productTypeId: stagingProduct.productTypeId,
              sellingPrice: stagingProduct.sellingPrice,
              status: stagingProduct.status,
              categoryId: stagingProduct.categoryId,
              tags: stagingProduct.tags,
              stockLevel: stagingProduct.stockLevel,
              reorderPoint: stagingProduct.reorderPoint,
              updatedAt: new Date()
            }
          });
        } else {
          // Create new product
          await prisma.product.create({
            data: {
              id: stagingProduct.id,
              productCode: stagingProduct.productCode,
              productName: stagingProduct.productName,
              description: stagingProduct.description,
              productTypeId: stagingProduct.productTypeId,
              sellingPrice: stagingProduct.sellingPrice,
              status: stagingProduct.status,
              categoryId: stagingProduct.categoryId,
              tags: stagingProduct.tags,
              stockLevel: stagingProduct.stockLevel,
              reorderPoint: stagingProduct.reorderPoint,
              createdAt: stagingProduct.createdAt,
              updatedAt: new Date()
            }
          });
        }

        // Handle suppliers
        const stagingSuppliers = await prisma.productSupplierStaging.findMany({
          where: { productId: stagingProduct.id }
        });

        // Remove existing supplier relationships in production
        await prisma.productSupplier.deleteMany({
          where: { productId: stagingProduct.id }
        });

        // Create new supplier relationships in production
        for (const stagingSupplier of stagingSuppliers) {
          await prisma.productSupplier.create({
            data: {
              productId: stagingProduct.id,
              supplierId: stagingSupplier.supplierId,
              costPrice: stagingSupplier.costPrice,
              isPrimary: stagingSupplier.isPrimary,
              isActive: stagingSupplier.isActive,
              createdAt: stagingSupplier.createdAt,
              updatedAt: new Date()
            }
          });
        }

        publishedCount++;
      }
    }

    // Clear all staging data
    await prisma.productStaging.deleteMany({});
    await prisma.productSupplierStaging.deleteMany({});

    return NextResponse.json({
      success: true,
      publishedCount
    });
  } catch (error) {
    console.error("Failed to publish products:", error);
    return NextResponse.json(
      { error: "Failed to publish products" },
      { status: 500 }
    );
  }
}
