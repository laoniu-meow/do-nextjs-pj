import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET: Retrieve all staging promotions
export async function GET() {
  try {
    const promotions = await prisma.promotionStaging.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: promotions,
      message: 'Staging promotions retrieved successfully',
    });
  } catch (error) {
    console.error('Error loading staging promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load staging promotions' }, 
      { status: 500 }
    );
  }
}

// POST: Save promotions to staging (create or update)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { promotions } = body;

    if (!Array.isArray(promotions)) {
      return NextResponse.json(
        { success: false, error: 'Invalid promotions data' },
        { status: 400 }
      );
    }

    // Clear existing staging promotions and create new ones
    await prisma.promotionStaging.deleteMany({});

    const savedPromotions = [];
    for (const promotion of promotions) {
      const savedPromotion = await prisma.promotionStaging.create({
        data: {
          name: promotion.name,
          code: promotion.code,
          type: promotion.type,
          value: promotion.value,
          isActive: promotion.isActive,
          startsAt: promotion.startsAt ? new Date(promotion.startsAt) : null,
          endsAt: promotion.endsAt ? new Date(promotion.endsAt) : null,
          allowStacking: promotion.allowStacking,
          stackingPriority: promotion.stackingPriority,
          maxUses: promotion.maxUses,
          maxUsesPerUser: promotion.maxUsesPerUser,
        },
      });
      savedPromotions.push(savedPromotion);
    }

    return NextResponse.json({
      success: true,
      data: savedPromotions,
      message: 'Promotions saved to staging successfully',
    });
  } catch (error) {
    console.error('Error saving promotions to staging:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save promotions to staging' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a specific promotion from staging
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    // Check if the promotion exists
    const existingPromotion = await prisma.promotionStaging.findUnique({
      where: { id }
    });

    if (!existingPromotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion not found' },
        { status: 404 }
      );
    }

    // Delete the promotion
    await prisma.promotionStaging.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Promotion removed from staging successfully',
    });
  } catch (error) {
    console.error('Error removing promotion from staging:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove promotion from staging' },
      { status: 500 }
    );
  }
}
