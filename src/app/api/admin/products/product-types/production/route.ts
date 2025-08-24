import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET /api/admin/products/product-types/production
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productionProductTypes = await prisma.productType.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" }
      ]
    });

    return NextResponse.json(productionProductTypes);
  } catch (error) {
    console.error("Failed to fetch production product types:", error);
    return NextResponse.json(
      { error: "Failed to fetch production product types" },
      { status: 500 }
    );
  }
}
