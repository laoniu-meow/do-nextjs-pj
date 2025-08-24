import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// POST: Publish categories from staging to production (same pattern as supplier)
export async function POST() {
  try {
    // Get staging data
    const stagingData = await prisma.categoryStaging.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    if (stagingData.length === 0) {
      // If no staging data, clear production data (this handles deletions)
      await prisma.category.deleteMany({});
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Production categories cleared (no staging data to publish)',
      });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Clear existing production data
      await tx.category.deleteMany({});

      // Move staging data to production (only active categories, not deleted ones)
      const productionData = [];
      for (const category of stagingData) {
        // Only publish active categories (not deleted ones)
        if (!category.isDeleted) {
          const productionCategory = await tx.category.create({
            data: {
              name: category.name,
              slug: category.slug,
              description: category.description,
              parentId: category.parentId,
              isActive: category.isActive,
              sortOrder: category.sortOrder,
            },
          });
          productionData.push(productionCategory);
        }
      }

      // Clear staging data
      await tx.categoryStaging.deleteMany({});

      return productionData;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `${result.length} category(ies) published to production successfully`,
    });
  } catch (error) {
    console.error('Error publishing categories to production:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish categories to production' }, 
      { status: 500 }
    );
  }
}
