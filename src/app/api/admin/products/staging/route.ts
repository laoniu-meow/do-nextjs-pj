import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

// GET /api/admin/products/staging - get all staging products
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stagingProducts = await prisma.productStaging.findMany({
      where: { isDeleted: false },
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
        { createdAt: "desc" }
      ]
    });

    return NextResponse.json(stagingProducts);
  } catch (error) {
    console.error("Failed to fetch staging products:", error);
    return NextResponse.json(
      { error: "Failed to fetch staging products" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products/staging - create new staging product
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Check if product code already exists in staging
    const existingProduct = await prisma.productStaging.findFirst({
      where: {
        productCode,
        isDeleted: false
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this code already exists in staging" },
        { status: 409 }
      );
    }

    // Create the staging product
    const product = await prisma.productStaging.create({
      data: {
        productCode,
        productName,
        description,
        productTypeId,
        sellingPrice,
        status: status || "DRAFT",
        categoryId: categoryId || null,
        tags: tags || [],
        stockLevel: stockLevel || 0,
        reorderPoint: reorderPoint || 0,
        isDeleted: false
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

    // If suppliers are provided, create product-supplier relationships
    if (suppliers && suppliers.length > 0) {
      for (const supplier of suppliers) {
        await prisma.productSupplierStaging.create({
          data: {
            productId: product.id,
            supplierId: supplier.supplierId,
            costPrice: supplier.costPrice,
            isPrimary: supplier.isPrimary || false,
            isActive: true
          }
        });
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create staging product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
