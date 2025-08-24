import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/shop/categories - list all production categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            sortOrder: true,
          },
          orderBy: [
            { sortOrder: 'asc' },
            { name: 'asc' }
          ]
        }
      }
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error listing categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list categories' }, 
      { status: 500 }
    );
  }
}

// POST /api/admin/shop/categories - create category (for direct production use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      parentId,
      isActive = true,
      sortOrder = 0,
    } = body || {};

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'name and slug are required' }, 
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' }, 
        { status: 400 }
      );
    }

    // Check if parent exists (if provided)
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId }
      });

      if (!parentCategory) {
        return NextResponse.json(
          { success: false, error: 'Parent category not found' }, 
          { status: 400 }
        );
      }
    }

    const created = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        parentId: parentId || null,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
      include: {
        parent: {
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
    console.error('Error creating category:', error);
    const message = (error as Error)?.message?.includes('Unique constraint') 
      ? 'Category slug already exists' 
      : 'Failed to create category';
    return NextResponse.json(
      { success: false, error: message }, 
      { status: 500 }
    );
  }
}
