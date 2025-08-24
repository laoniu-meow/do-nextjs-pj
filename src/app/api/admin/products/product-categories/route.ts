import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/products/product-categories - list all production product categories
export async function GET() {
  try {
    // Debug: Check if prisma client is working
    console.warn('Prisma client available:', !!prisma);
    console.warn('ProductCategory model available:', !!prisma.productCategory);
    
    // Try to get the count first using raw SQL to bypass any Prisma client issues
    const countResult = await prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM product_categories_hierarchy`;
    const count = Number(countResult[0]?.count) || 0;
    console.warn('ProductCategory count (raw SQL):', count);
    
    // Use raw SQL to get the data to bypass any Prisma client issues
    const productCategories = await prisma.$queryRaw<Array<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      isActive: boolean;
      sortOrder: number;
      createdAt: Date;
      updatedAt: Date;
      categoryId: string | null;
      category_name: string | null;
      category_slug: string | null;
    }>>`
      SELECT 
        pc.id,
        pc.name,
        pc.slug,
        pc.description,
        pc."isActive",
        pc."sortOrder",
        pc."createdAt",
        pc."updatedAt",
        pc."categoryId",
        c.name as category_name,
        c.slug as category_slug
      FROM product_categories_hierarchy pc
      LEFT JOIN categories c ON pc."categoryId" = c.id
      ORDER BY pc."sortOrder" ASC, pc.name ASC
    `;

    console.warn('Found product categories (raw SQL):', productCategories.length);
    
    // Transform the raw data to match the expected format
    const transformedCategories = productCategories.map((pc) => ({
      id: pc.id,
      name: pc.name,
      slug: pc.slug,
      description: pc.description,
      isActive: pc.isActive,
      sortOrder: pc.sortOrder,
      createdAt: pc.createdAt,
      updatedAt: pc.updatedAt,
      categoryId: pc.categoryId,
      category: pc.categoryId ? {
        id: pc.categoryId,
        name: pc.category_name,
        slug: pc.category_slug
      } : null
    }));
    
    return NextResponse.json({ success: true, data: transformedCategories });
  } catch (error) {
    console.error('Error listing production product categories:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : 'Unknown'
    });
    return NextResponse.json(
      { success: false, error: 'Failed to list production product categories' }, 
      { status: 500 }
    );
  }
}

// POST /api/admin/products/product-categories - create new production product category
export async function POST(request: NextRequest) {
  try {
    const { name, slug, description, categoryId, isActive, sortOrder } = await request.json();

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' }, 
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { slug }
    });

    if (existingProductCategory) {
      return NextResponse.json(
        { success: false, error: 'Product category with this slug already exists' }, 
        { status: 400 }
      );
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

    const created = await prisma.productCategory.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        categoryId: categoryId || null,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
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

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error creating production product category:', error);
    const message = (error as Error)?.message?.includes('Unique constraint') 
      ? 'Product category slug already exists' 
      : 'Failed to create production product category';
    return NextResponse.json(
      { success: false, error: message }, 
      { status: 500 }
    );
  }
}
