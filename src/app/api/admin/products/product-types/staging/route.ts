import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

// GET /api/admin/products/product-types/staging
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stagingProductTypes = await prisma.productTypeStaging.findMany({
      where: { isDeleted: false },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" }
      ]
    });

    return NextResponse.json(stagingProductTypes);
  } catch (error) {
    console.error("Failed to fetch staging product types:", error);
    return NextResponse.json(
      { error: "Failed to fetch staging product types" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products/product-types/staging
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Check for duplicate slug in the same category
    const existingProductType = await prisma.productTypeStaging.findFirst({
      where: {
        slug,
        productCategoryId,
        isDeleted: false
      }
    });

    if (existingProductType) {
      return NextResponse.json(
        { error: "A product type with this name already exists in the selected category" },
        { status: 409 }
      );
    }

    const productType = await prisma.productTypeStaging.create({
      data: {
        name,
        slug,
        description,
        productCategoryId,
        isActive,
        sortOrder: sortOrder || 0
      }
    });

    return NextResponse.json(productType, { status: 201 });
  } catch (error) {
    console.error("Failed to create staging product type:", error);
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    );
  }
}
