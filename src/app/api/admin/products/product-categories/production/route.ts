import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// POST /api/admin/products/product-categories/production - upload staging to production
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

    // Upload active staging product categories to production
    const uploadedProductCategories = [];
    for (const stagingProductCategory of stagingProductCategories) {
      if (!stagingProductCategory.isDeleted) {
        const uploadedProductCategory = await prisma.productCategory.create({
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
        uploadedProductCategories.push(uploadedProductCategory);
      }
    }

    // Clear staging data after successful upload
    await prisma.productCategoryStaging.deleteMany({});

    return NextResponse.json({
      success: true,
      data: uploadedProductCategories,
      message: `Successfully uploaded ${uploadedProductCategories.length} product categories to production`,
    });
  } catch (error) {
    console.error('Error uploading product categories to production:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload product categories to production' }, 
      { status: 500 }
    );
  }
}
