import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/products/product-categories/staging - list all staging product categories
export async function GET() {
  try {
    // Verify Prisma client is properly initialized
    if (!prisma || !prisma.productCategoryStaging) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json(
        { success: false, error: 'Database connection error' }, 
        { status: 500 }
      );
    }

    const productCategories = await prisma.productCategoryStaging.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ success: true, data: productCategories });
  } catch (error) {
    console.error('Error listing staging product categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list staging product categories' }, 
      { status: 500 }
    );
  }
}

// POST: Create new staging product category OR bulk save (same pattern as category)
export async function POST(request: NextRequest) {
  try {
    // Verify Prisma client is properly initialized
    if (!prisma || !prisma.productCategoryStaging) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json(
        { success: false, error: 'Database connection error' }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Check if this is a bulk save operation (like category settings)
    if (body.productCategories && Array.isArray(body.productCategories)) {
      // Bulk save to staging (clear existing and create new)
      try {
        await prisma.productCategoryStaging.deleteMany({});
      } catch (error) {
        console.error('Error clearing staging data:', error);
        throw new Error(`Failed to clear staging data: ${error}`);
      }

      const savedProductCategories = [];
      for (const productCategory of body.productCategories) {
        const savedProductCategory = await prisma.productCategoryStaging.create({
          data: {
            name: productCategory.name,
            slug: productCategory.slug,
            description: productCategory.description || null,
            categoryId: productCategory.categoryId || null,
            isActive: productCategory.isActive !== undefined ? productCategory.isActive : true,
            sortOrder: productCategory.sortOrder || 0,
            isDeleted: false,
          },
        });
        savedProductCategories.push(savedProductCategory);
      }

      return NextResponse.json({
        success: true,
        data: savedProductCategories,
        message: 'Product categories saved to staging successfully',
      });
    }

    // Individual product category creation (existing logic)
    const { name, slug, description, categoryId, isActive, sortOrder } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' }, 
        { status: 400 }
      );
    }

    // Check if slug already exists in staging (if provided)
    if (slug) {
      const existingProductCategory = await prisma.productCategoryStaging.findUnique({
        where: { slug }
      });

      if (existingProductCategory) {
        return NextResponse.json(
          { success: false, error: 'Product category with this slug already exists in staging' }, 
          { status: 400 }
        );
      }
    }

    // Check if category exists (if provided)
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' }, 
          { status: 400 }
        );
      }
    }

    const created = await prisma.productCategoryStaging.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        categoryId: categoryId || null,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
        isDeleted: false,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating staging product category:', error);
    const message = (error as Error)?.message?.includes('Unique constraint') 
      ? 'Product category slug already exists in staging' 
      : 'Failed to create staging product category';
    return NextResponse.json(
      { success: false, error: message }, 
      { status: 500 }
    );
  }
}

// PUT: Update staging product categories (bulk replace with deletion tracking - same as category)
export async function PUT(request: NextRequest) {
  try {
    // Verify Prisma client is properly initialized
    if (!prisma || !prisma.productCategoryStaging) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json(
        { success: false, error: 'Database connection error' }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    const { productCategories: activeProductCategories = [], deletedProductCategories = [] } = body;

    console.warn('Product category staging PUT - received:', {
      activeProductCategories: activeProductCategories.length,
      deletedProductCategories: deletedProductCategories.length
    });

    // Clear existing staging data
    try {
      await prisma.productCategoryStaging.deleteMany({});
    } catch (error) {
      console.error('Error clearing staging data:', error);
      throw new Error(`Failed to clear staging data: ${error}`);
    }

    // Create active product categories (isDeleted: false)
    const activeProductCategoryData = activeProductCategories.map((productCategory: Record<string, unknown>) => ({
      name: typeof productCategory.name === 'string' ? productCategory.name : 'Untitled Product Category',
      slug: typeof productCategory.slug === 'string' ? productCategory.slug : 'untitled-product-category',
      description: typeof productCategory.description === 'string' ? productCategory.description : null,
      categoryId: typeof productCategory.categoryId === 'string' ? productCategory.categoryId : null,
      isActive: Boolean(productCategory.isActive),
      sortOrder: Number(productCategory.sortOrder) || 0,
      isDeleted: false,
    }));

    const savedActiveProductCategories = [];
    for (const productCategoryData of activeProductCategoryData) {
      const savedProductCategory = await prisma.productCategoryStaging.create({
        data: productCategoryData,
      });
      savedActiveProductCategories.push(savedProductCategory);
    }

    // Create deleted product categories (isDeleted: true)
    const deletedProductCategoryData = deletedProductCategories.map((productCategory: Record<string, unknown>) => ({
      name: typeof productCategory.name === 'string' ? productCategory.name : 'Deleted Product Category',
      slug: typeof productCategory.slug === 'string' ? productCategory.slug : 'deleted-product-category',
      description: typeof productCategory.description === 'string' ? productCategory.description : null,
      categoryId: typeof productCategory.categoryId === 'string' ? productCategory.categoryId : null,
      isActive: Boolean(productCategory.isActive),
      sortOrder: Number(productCategory.sortOrder) || 0,
      isDeleted: true,
    }));

    const savedDeletedProductCategories = [];
    for (const productCategoryData of deletedProductCategoryData) {
      const savedProductCategory = await prisma.productCategoryStaging.create({
        data: productCategoryData,
      });
      savedDeletedProductCategories.push(savedProductCategory);
    }

    return NextResponse.json({
      success: true,
      data: {
        activeProductCategories: savedActiveProductCategories,
        deletedProductCategories: savedDeletedProductCategories,
      },
      message: 'Product categories updated in staging successfully',
    });
  } catch (error) {
    console.error('Error updating staging product categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staging product categories' }, 
      { status: 500 }
    );
  }
}
