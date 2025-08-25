import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

// PUT /api/admin/products/product-types/staging/[id]
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
    const { name, description, productCategoryId, isActive, sortOrder } = body;

    // Validate required fields
    if (!name || !productCategoryId) {
      return NextResponse.json(
        { error: "Name and Product Category are required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check for duplicate slug in the same category (excluding current item)
    const existingProductType = await prisma.productTypeStaging.findFirst({
      where: {
        slug,
        productCategoryId,
        isDeleted: false,
        id: { not: id }
      }
    });

    if (existingProductType) {
      return NextResponse.json(
        { error: "A product type with this name already exists in the selected category" },
        { status: 409 }
      );
    }

    const productType = await prisma.productTypeStaging.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        productCategoryId,
        isActive,
        sortOrder: sortOrder || 0,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(productType);
  } catch (error) {
    console.error("Failed to update staging product type:", error);
    return NextResponse.json(
      { error: "Failed to update product type" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/product-types/staging/[id]
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

    // Soft delete by marking as deleted
    await prisma.productTypeStaging.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete staging product type:", error);
    return NextResponse.json(
      { error: "Failed to delete product type" },
      { status: 500 }
    );
  }
}
