import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

// PUT /api/admin/products/staging/[id] - update staging product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      productCode,
      productName,
      description,
      productTypeId,
      sellingPrice,
      status,
      categoryId,
      tags,
      stockLevel,
      reorderPoint,
      suppliers
    } = body;

    // Validate required fields
    if (!productCode || !productName || !productTypeId || sellingPrice === undefined) {
      return NextResponse.json(
        { error: "Product code, name, type, and selling price are required" },
        { status: 400 }
      );
    }

    // Check if product code already exists in staging (excluding current product)
    const existingProduct = await prisma.productStaging.findFirst({
      where: {
        productCode,
        isDeleted: false,
        id: { not: id }
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this code already exists in staging" },
        { status: 409 }
      );
    }

    // Update the staging product
    const product = await prisma.productStaging.update({
      where: { id },
      data: {
        productCode,
        productName,
        description,
        productTypeId,
        sellingPrice,
        status,
        categoryId: categoryId || null,
        tags: tags || [],
        stockLevel: stockLevel || 0,
        reorderPoint: reorderPoint || 0,
        updatedAt: new Date()
      },
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
      }
    });

    // Update suppliers if provided
    if (suppliers && suppliers.length > 0) {
      // Remove existing supplier relationships
      await prisma.productSupplierStaging.deleteMany({
        where: { productId: id }
      });

      // Create new supplier relationships
      for (const supplier of suppliers) {
        await prisma.productSupplierStaging.create({
          data: {
            productId: id,
            supplierId: supplier.supplierId,
            costPrice: supplier.costPrice,
            isPrimary: supplier.isPrimary || false,
            isActive: true
          }
        });
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update staging product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/staging/[id] - mark staging product as deleted
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Mark the product as deleted instead of actually deleting it
    await prisma.productStaging.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete staging product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
