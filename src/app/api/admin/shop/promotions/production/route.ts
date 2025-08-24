import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = 'nodejs';

// POST: Move staging promotions to production
export async function POST() {
  try {
    // Get staging data
    const stagingData = await prisma.promotionStaging.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (stagingData.length === 0) {
      // If no staging data, clear production data (this handles deletions)
      await prisma.promotion.deleteMany({});
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Production promotions cleared (no staging data to upload)',
      });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Clear existing production data
      await tx.promotion.deleteMany({});

      // Move staging data to production
      const productionData = [];
      for (const promotion of stagingData) {
        const productionPromotion = await tx.promotion.create({
          data: {
            name: promotion.name,
            code: promotion.code,
            type: promotion.type,
            value: promotion.value,
            isActive: promotion.isActive,
            startsAt: promotion.startsAt,
            endsAt: promotion.endsAt,
            allowStacking: promotion.allowStacking,
            stackingPriority: promotion.stackingPriority,
            maxUses: promotion.maxUses,
            maxUsesPerUser: promotion.maxUsesPerUser,
          },
        });
        productionData.push(productionPromotion);
      }

      // Clear staging data
      await tx.promotionStaging.deleteMany({});

      return productionData;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `${result.length} promotion(s) moved to production successfully`,
    });
  } catch (error) {
    console.error('Error uploading promotions to production:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload promotions to production' },
      { status: 500 }
    );
  }
}
