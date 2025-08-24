import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/products/categories/staging - list all staging categories
export async function GET() {
  try {
    // Verify Prisma client is properly initialized
    if (!prisma || !prisma.categoryStaging) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json(
        { success: false, error: 'Database connection error' }, 
        { status: 500 }
      );
    }

    const categories = await prisma.categoryStaging.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error listing staging categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list staging categories' }, 
      { status: 500 }
    );
  }
}

// POST: Create new staging category OR bulk save (same pattern as supplier)
export async function POST(request: NextRequest) {
  try {
    // Verify Prisma client is properly initialized
    if (!prisma || !prisma.categoryStaging) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json(
        { success: false, error: 'Database connection error' }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Check if this is a bulk save operation (like tax settings)
    if (body.categories && Array.isArray(body.categories)) {
      // Bulk save to staging (clear existing and create new)
      await prisma.categoryStaging.deleteMany({});

      const savedCategories = [];
      for (const category of body.categories) {
        const savedCategory = await prisma.categoryStaging.create({
          data: {
            name: category.name,
            slug: category.slug,
            description: category.description || null,
            parentId: category.parentId || null,
            isActive: category.isActive !== undefined ? category.isActive : true,
            sortOrder: category.sortOrder || 0,
            isDeleted: false,
          },
        });
        savedCategories.push(savedCategory);
      }

      return NextResponse.json({
        success: true,
        data: savedCategories,
        message: 'Categories saved to staging successfully',
      });
    }

    // Individual category creation (existing logic)
    const { name, slug, description, parentId, isActive, sortOrder } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' }, 
        { status: 400 }
      );
    }

    // Check if slug already exists in staging (if provided)
    if (slug) {
      const existingCategory = await prisma.categoryStaging.findUnique({
        where: { slug }
      });

      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'Category with this slug already exists in staging' }, 
          { status: 400 }
        );
      }
    }

    // Check if parent exists in staging (if provided)
    if (parentId) {
      const parentCategory = await prisma.categoryStaging.findUnique({
        where: { id: parentId }
      });

      if (!parentCategory) {
        return NextResponse.json(
          { success: false, error: 'Parent category not found in staging' }, 
          { status: 400 }
        );
      }
    }

    const created = await prisma.categoryStaging.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        parentId: parentId || null,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
        isDeleted: false,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating staging category:', error);
    const message = (error as Error)?.message?.includes('Unique constraint') 
      ? 'Category slug already exists in staging' 
      : 'Failed to create staging category';
    return NextResponse.json(
      { success: false, error: message }, 
      { status: 500 }
    );
  }
}

// PUT: Update staging categories (bulk replace with deletion tracking - same as tax and supplier)
export async function PUT(request: NextRequest) {
  try {
    // Debug logging
    console.warn('PUT request received');
    console.warn('Prisma client type:', typeof prisma);
    console.warn('Prisma client keys:', Object.keys(prisma || {}));
    console.warn('CategoryStaging available:', !!prisma?.categoryStaging);
    
    // Verify Prisma client is properly initialized
    if (!prisma || !prisma.categoryStaging) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json(
        { success: false, error: 'Database connection error' }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    const { categories: activeCategories = [], deletedCategories = [] } = body;

    console.warn('Category staging PUT - received:', {
      activeCategories: activeCategories.length,
      deletedCategories: deletedCategories.length
    });

    // Clear existing staging data
    try {
      await prisma.categoryStaging.deleteMany({});
    } catch (error) {
      console.error('Error clearing staging data:', error);
      throw new Error(`Failed to clear staging data: ${error}`);
    }

    // Create active categories (isDeleted: false)
    const activeCategoryData = activeCategories.map((category: Record<string, unknown>) => ({
      name: typeof category.name === 'string' ? category.name : 'Untitled Category',
      slug: typeof category.slug === 'string' ? category.slug : 'untitled-category',
      description: typeof category.description === 'string' ? category.description : null,
      parentId: typeof category.parentId === 'string' ? category.parentId : null,
      isActive: Boolean(category.isActive),
      sortOrder: Number(category.sortOrder) || 0,
      isDeleted: false,
    }));

    const savedActiveCategories = [];
    for (const categoryData of activeCategoryData) {
      const savedCategory = await prisma.categoryStaging.create({
        data: categoryData,
      });
      savedActiveCategories.push(savedCategory);
    }

    // Create deleted categories (isDeleted: true)
    const deletedCategoryData = deletedCategories.map((category: Record<string, unknown>) => ({
      name: typeof category.name === 'string' ? category.name : 'Deleted Category',
      slug: typeof category.slug === 'string' ? category.slug : 'deleted-category',
      description: typeof category.description === 'string' ? category.description : null,
      parentId: typeof category.parentId === 'string' ? category.parentId : null,
      isActive: Boolean(category.isActive),
      sortOrder: Number(category.sortOrder) || 0,
      isDeleted: true,
    }));

    const savedDeletedCategories = [];
    for (const categoryData of deletedCategoryData) {
      const savedCategory = await prisma.categoryStaging.create({
        data: categoryData,
      });
      savedDeletedCategories.push(savedCategory);
    }

    return NextResponse.json({
      success: true,
      data: {
        activeCategories: savedActiveCategories,
        deletedCategories: savedDeletedCategories,
      },
      message: 'Categories updated in staging successfully',
    });
  } catch (error) {
    console.error('Error updating staging categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staging categories' }, 
      { status: 500 }
    );
  }
}
