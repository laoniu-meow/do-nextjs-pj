import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/admin/shop/suppliers/staging - list all staging suppliers
export async function GET() {
  try {
    // Test database connection first
    await prisma.$connect();
    console.warn('Database connection successful');
    
    // Check if table exists by trying to count records
    const totalCount = await prisma.supplierStaging.count();
    console.warn('Total staging suppliers count:', totalCount);
    
    // Get all suppliers from staging first
    const allStagingSuppliers = await prisma.supplierStaging.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true,
        notes: true,
        isActive: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Separate active and deleted suppliers
    const activeSuppliers = allStagingSuppliers.filter(supplier => !supplier.isDeleted);
    const deletedSuppliers = allStagingSuppliers.filter(supplier => supplier.isDeleted);

    console.warn('Staging suppliers loaded:', {
      total: allStagingSuppliers.length,
      active: activeSuppliers.length,
      deleted: deletedSuppliers.length
    });

    return NextResponse.json({ 
      success: true, 
      data: activeSuppliers,
      deletedRules: deletedSuppliers
    });
  } catch (error) {
    console.error('Error loading staging suppliers:', error);
    
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
      { success: false, error: 'Failed to load staging suppliers' }, 
      { status: 500 }
    );
  }
}

// POST /api/admin/shop/suppliers/staging - create new staging supplier OR bulk save
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a bulk save operation (like tax settings)
    if (body.suppliers && Array.isArray(body.suppliers)) {
      // Bulk save to staging (clear existing and create new)
      await prisma.supplierStaging.deleteMany({});

      const savedSuppliers = [];
      for (const supplier of body.suppliers) {
        const savedSupplier = await prisma.supplierStaging.create({
          data: {
            name: supplier.name,
            code: supplier.code,
            email: supplier.email || null,
            phone: supplier.phone || null,
            notes: supplier.notes || null,
            isActive: supplier.isActive !== undefined ? supplier.isActive : true,
          },
        });
        savedSuppliers.push(savedSupplier);
      }

      return NextResponse.json({
        success: true,
        suppliers: savedSuppliers,
        message: 'Suppliers saved to staging successfully',
      });
    }

    // Individual supplier creation (existing logic)
    const { name, code, email, phone, notes, isActive } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'Name and code are required' }, 
        { status: 400 }
      );
    }

    // Check if code already exists in staging
    const existingStagingSupplier = await prisma.supplierStaging.findUnique({
      where: { code },
    });

    if (existingStagingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier code already exists in staging' }, 
        { status: 400 }
      );
    }

    // Create new staging supplier
    const supplier = await prisma.supplierStaging.create({
      data: {
        name,
        code,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        name: true,
        code: true,
        email: true,
        phone: true,
        notes: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      supplier,
      message: 'Staging supplier created successfully' 
    });
  } catch (error) {
    console.error('Error creating staging supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staging supplier' }, 
      { status: 500 }
    );
  }
}

// PUT /api/admin/shop/suppliers/staging - bulk save suppliers and deleted suppliers (like tax settings)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { suppliers: activeSuppliers = [], deletedSuppliers = [] } = body;

    console.warn('Supplier staging PUT - received:', {
      activeSuppliers: activeSuppliers.length,
      deletedSuppliers: deletedSuppliers.length
    });

    // Clear existing staging data
    await prisma.supplierStaging.deleteMany({});

    // Create active suppliers (isDeleted: false)
    const activeSupplierData = activeSuppliers.map((supplier: Record<string, unknown>) => ({
      name: typeof supplier.name === 'string' ? supplier.name : 'Untitled Supplier',
      code: typeof supplier.code === 'string' ? supplier.code : `SUP-${Date.now()}`,
      email: typeof supplier.email === 'string' ? supplier.email : null,
      phone: typeof supplier.phone === 'string' ? supplier.phone : null,
      notes: typeof supplier.notes === 'string' ? supplier.notes : null,
      isActive: Boolean(supplier.isActive),
      isDeleted: false,
    }));

    // Create deleted suppliers (isDeleted: true)
    const deletedSupplierData = deletedSuppliers.map((supplier: Record<string, unknown>) => ({
      name: typeof supplier.name === 'string' ? supplier.name : 'Deleted Supplier',
      code: typeof supplier.code === 'string' ? supplier.code : `DEL-${Date.now()}`,
      email: typeof supplier.email === 'string' ? supplier.email : null,
      phone: typeof supplier.phone === 'string' ? supplier.phone : null,
      notes: typeof supplier.notes === 'string' ? supplier.notes : null,
      isActive: Boolean(supplier.isActive),
      isDeleted: true,
    }));

    // Save all suppliers to staging
    const allSupplierData = [...activeSupplierData, ...deletedSupplierData];
    
    if (allSupplierData.length > 0) {
      await prisma.supplierStaging.createMany({
        data: allSupplierData,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${activeSupplierData.length} active and ${deletedSupplierData.length} deleted suppliers to staging`,
      activeCount: activeSupplierData.length,
      deletedCount: deletedSupplierData.length,
    });
  } catch (error) {
    console.error('Error saving suppliers to staging:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save suppliers to staging' },
      { status: 500 }
    );
  }
}
