import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// POST /api/admin/products/product-categories/publish - publish staging to production
export async function POST() {
  try {
    // Get all staging product categories
    const stagingProductCategories = await prisma.productCategoryStaging.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    if (stagingProductCategories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No staging product categories found' }, 
        { status: 400 }
      );
    }

    // Clear existing production product categories
    await prisma.productCategory.deleteMany({});

    // Publish active staging product categories to production
    const publishedProductCategories = [];
    for (const stagingProductCategory of stagingProductCategories) {
      if (!stagingProductCategory.isDeleted) {
        const publishedProductCategory = await prisma.productCategory.create({
          data: {
            name: stagingProductCategory.name,
            slug: stagingProductCategory.slug,
            description: stagingProductCategory.description,
            categoryId: stagingProductCategory.categoryId,
            isActive: stagingProductCategory.isActive,
            sortOrder: stagingProductCategory.sortOrder,
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        });
        publishedProductCategories.push(publishedProductCategory);
      }
    }

    // Clear staging data after successful publish
    await prisma.productCategoryStaging.deleteMany({});

    return NextResponse.json({
      success: true,
      data: publishedProductCategories,
      message: `Successfully published ${publishedProductCategories.length} product categories to production`,
    });
  } catch (error) {
    console.error('Error publishing product categories to production:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish product categories to production' }, 
      { status: 500 }
    );
  }
}
