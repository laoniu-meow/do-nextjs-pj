import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

// GET /api/admin/products/production - get all production products
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productionProducts = await prisma.product.findMany({
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

    return NextResponse.json(productionProducts);
  } catch (error) {
    console.error("Failed to fetch production products:", error);
    return NextResponse.json(
      { error: "Failed to fetch production products" },
      { status: 500 }
    );
  }
}
