import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET: Retrieve all staging promotions (same pattern as tax and supplier)
export async function GET() {
  try {
    // Test database connection first
    await prisma.$connect();
    console.warn('Database connection successful');
    
    // Check if table exists by trying to count records
    const totalCount = await prisma.promotionStaging.count();
    console.warn('Total staging promotions count:', totalCount);
    
    // Get all promotions from staging first
    const allStagingPromotions = await prisma.promotionStaging.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
        value: true,
        isActive: true,
        startsAt: true,
        endsAt: true,
        allowStacking: true,
        stackingPriority: true,
        maxUses: true,
        maxUsesPerUser: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Separate active and deleted promotions
    const activePromotions = allStagingPromotions.filter(promotion => !promotion.isDeleted);
    const deletedPromotions = allStagingPromotions.filter(promotion => promotion.isDeleted);

    console.warn('Staging promotions loaded:', {
      total: allStagingPromotions.length,
      active: activePromotions.length,
      deleted: deletedPromotions.length
    });

    return NextResponse.json({ 
      success: true, 
      data: activePromotions,
      deletedRules: deletedPromotions
    });
  } catch (error) {
    console.error('Error loading staging promotions:', error);
    
    // If it's a table not found error or similar, return empty data instead of 500
    if (error instanceof Error && (
      error.message.includes('does not exist') || 
      error.message.includes('relation') ||
      error.message.includes('table')
    )) {
      console.warn('Table does not exist, returning empty data');
      return NextResponse.json({ 
        success: true, 
        data: [],
        deletedRules: []
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to load staging promotions' }, 
      { status: 500 }
    );
  }
}

// POST: Create new staging promotion OR bulk save (same pattern as supplier)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a bulk save operation (like tax settings)
    if (body.promotions && Array.isArray(body.promotions)) {
      // Bulk save to staging (clear existing and create new)
      await prisma.promotionStaging.deleteMany({});

      const savedPromotions = [];
      for (const promotion of body.promotions) {
        const savedPromotion = await prisma.promotionStaging.create({
          data: {
            name: promotion.name,
            code: promotion.code,
            type: promotion.type,
            value: promotion.value,
            isActive: promotion.isActive !== undefined ? promotion.isActive : true,
            startsAt: promotion.startsAt ? new Date(promotion.startsAt) : null,
            endsAt: promotion.endsAt ? new Date(promotion.endsAt) : null,
            allowStacking: promotion.allowStacking !== undefined ? promotion.allowStacking : true,
            stackingPriority: promotion.stackingPriority || 0,
            maxUses: promotion.maxUses || null,
            maxUsesPerUser: promotion.maxUsesPerUser || null,
          },
        });
        savedPromotions.push(savedPromotion);
      }

      return NextResponse.json({
        success: true,
        promotions: savedPromotions,
        message: 'Promotions saved to staging successfully',
      });
    }

    // Individual promotion creation (existing logic)
    const { name, type, value, code, isActive, startsAt, endsAt, allowStacking, stackingPriority, maxUses, maxUsesPerUser } = body;

    // Validate required fields
    if (!name || !type || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, type, and value are required' }, 
        { status: 400 }
      );
    }

    // Check if code already exists in staging (if provided)
    if (code) {
      const existingStagingPromotion = await prisma.promotionStaging.findUnique({
        where: { code },
      });

      if (existingStagingPromotion) {
        return NextResponse.json(
          { success: false, error: 'Promotion code already exists in staging' }, 
          { status: 400 }
        );
      }
    }

    // Create new staging promotion
    const promotion = await prisma.promotionStaging.create({
      data: {
        name,
        code: code || null,
        type,
        value,
        isActive: isActive !== undefined ? isActive : true,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        allowStacking: allowStacking !== undefined ? allowStacking : true,
        stackingPriority: stackingPriority || 0,
        maxUses: maxUses || null,
        maxUsesPerUser: maxUsesPerUser || null,
      },
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
        value: true,
        isActive: true,
        startsAt: true,
        endsAt: true,
        allowStacking: true,
        stackingPriority: true,
        maxUses: true,
        maxUsesPerUser: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      promotion,
      message: 'Staging promotion created successfully' 
    });
  } catch (error) {
    console.error('Error creating staging promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staging promotion' }, 
      { status: 500 }
    );
  }
}

// PUT: Update staging promotions (bulk replace with deletion tracking - same as tax and supplier)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { promotions: activePromotions = [], deletedPromotions = [] } = body;

    console.warn('Promotion staging PUT - received:', {
      activePromotions: activePromotions.length,
      deletedPromotions: deletedPromotions.length
    });

    // Clear existing staging data
    await prisma.promotionStaging.deleteMany({});

    // Create active promotions (isDeleted: false)
    const activePromotionData = activePromotions.map((promotion: Record<string, unknown>) => ({
      name: typeof promotion.name === 'string' ? promotion.name : 'Untitled Promotion',
      code: typeof promotion.code === 'string' ? promotion.code : null,
      type: promotion.type || 'PERCENT',
      value: typeof promotion.value === 'number' ? promotion.value : 0,
      isActive: Boolean(promotion.isActive),
      startsAt: promotion.startsAt ? new Date(promotion.startsAt as string) : null,
      endsAt: promotion.endsAt ? new Date(promotion.endsAt as string) : null,
      allowStacking: Boolean(promotion.allowStacking),
      stackingPriority: Number(promotion.stackingPriority) || 0,
      maxUses: promotion.maxUses ? Number(promotion.maxUses) : null,
      maxUsesPerUser: promotion.maxUsesPerUser ? Number(promotion.maxUsesPerUser) : null,
      isDeleted: false,
    }));

    // Create deleted promotions (isDeleted: true)
    const deletedPromotionData = deletedPromotions.map((promotion: Record<string, unknown>) => ({
      name: typeof promotion.name === 'string' ? promotion.name : 'Deleted Promotion',
      code: typeof promotion.code === 'string' ? promotion.code : null,
      type: promotion.type || 'PERCENT',
      value: typeof promotion.value === 'number' ? promotion.value : 0,
      isActive: Boolean(promotion.isActive),
      startsAt: promotion.startsAt ? new Date(promotion.startsAt as string) : null,
      endsAt: promotion.endsAt ? new Date(promotion.endsAt as string) : null,
      allowStacking: Boolean(promotion.allowStacking),
      stackingPriority: Number(promotion.stackingPriority) || 0,
      maxUses: promotion.maxUses ? Number(promotion.maxUses) : null,
      maxUsesPerUser: promotion.maxUsesPerUser ? Number(promotion.maxUsesPerUser) : null,
      isDeleted: true,
    }));

    // Save all promotions to staging
    const allPromotionData = [...activePromotionData, ...deletedPromotionData];
    
    if (allPromotionData.length > 0) {
      await prisma.promotionStaging.createMany({
        data: allPromotionData,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${activePromotionData.length} active and ${deletedPromotionData.length} deleted promotions to staging`,
      activeCount: activePromotionData.length,
      deletedCount: deletedPromotionData.length,
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
