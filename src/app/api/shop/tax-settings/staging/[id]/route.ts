import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/shop/tax-settings/staging/[id] - get specific staging tax setting
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const taxSetting = await prisma.taxSettingStaging.findUnique({
      where: { id },
      select: {
        id: true,
        description: true,
        ratePercent: true,
        isInclusive: true,
        isGST: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!taxSetting) {
      return NextResponse.json(
        { success: false, error: 'Staging tax setting not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: taxSetting 
    });
  } catch (error) {
    console.error('Error loading staging tax setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load staging tax setting' }, 
      { status: 500 }
    );
  }
}

// PUT /api/shop/tax-settings/staging/[id] - update staging tax setting (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, ratePercent, isInclusive, isGST } = body;

    // Validate required fields
    if (!description || ratePercent === undefined) {
      return NextResponse.json(
        { success: false, error: 'Description and rate are required' }, 
        { status: 400 }
      );
    }

    // Check if description already exists for another staging tax setting (excluding current one)
    const existingStagingSetting = await prisma.taxSettingStaging.findFirst({
      where: { 
        description, 
        id: { not: id } 
      },
    });

    if (existingStagingSetting) {
      return NextResponse.json(
        { success: false, error: 'Tax setting description already exists in staging' }, 
        { status: 400 }
      );
    }

    // Update staging tax setting
    const taxSetting = await prisma.taxSettingStaging.update({
      where: { id },
      data: {
        description,
        ratePercent,
        isInclusive: isInclusive !== undefined ? isInclusive : false,
        isGST: isGST !== undefined ? isGST : false,
      },
      select: {
        id: true,
        description: true,
        ratePercent: true,
        isInclusive: true,
        isGST: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: taxSetting,
      message: 'Staging tax setting updated successfully' 
    });
  } catch (error) {
    console.error('Error updating staging tax setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staging tax setting' }, 
      { status: 500 }
    );
  }
}

// PATCH /api/shop/tax-settings/staging/[id] - partial update staging tax setting
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Update staging tax setting with partial data
    const taxSetting = await prisma.taxSettingStaging.update({
      where: { id },
      data: body,
      select: {
        id: true,
        description: true,
        ratePercent: true,
        isInclusive: true,
        isGST: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: taxSetting,
      message: 'Staging tax setting updated successfully' 
    });
  } catch (error) {
    console.error('Error updating staging tax setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staging tax setting' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/shop/tax-settings/staging/[id] - delete staging tax setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // First check if the record exists
    const existingSetting = await prisma.taxSettingStaging.findUnique({
      where: { id },
    });

    if (!existingSetting) {
      return NextResponse.json(
        { success: false, error: 'Tax setting not found in staging' }, 
        { status: 404 }
      );
    }

    // Now delete the record
    await prisma.taxSettingStaging.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Staging tax setting deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting staging tax setting:', error);
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Tax setting not found in staging' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete staging tax setting' }, 
      { status: 500 }
    );
  }
}
