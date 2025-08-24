import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/products/product-categories/test-db - test database connection
export async function GET() {
  try {
    // Test basic Prisma client functionality
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%product%'
      ORDER BY table_name
    `;
    
    // Check the structure of product_categories table
    let productCategoriesColumns = null;
    try {
      productCategoriesColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'product_categories' 
        ORDER BY ordinal_position
      `;
    } catch (e) {
      productCategoriesColumns = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
    
    // Check the structure of product_categories_hierarchy table
    let productCategoriesHierarchyColumns = null;
    try {
      productCategoriesHierarchyColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'product_categories_hierarchy' 
        ORDER BY ordinal_position
      `;
    } catch (e) {
      productCategoriesHierarchyColumns = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }

    return NextResponse.json({
      success: true,
      message: 'Database structure test',
      data: {
        test: result,
        tables,
        productCategoriesColumns,
        productCategoriesHierarchyColumns,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database structure test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database structure test failed',
      details: {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}
