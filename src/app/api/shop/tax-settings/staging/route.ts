import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET: Retrieve all staging tax settings
export async function GET() {
  try {
    const taxSettings = await prisma.taxSettingStaging.findMany({
      orderBy: { description: 'asc' }
    });
    
    return NextResponse.json({
      success: true,
      data: taxSettings,
      message: 'Staging tax settings retrieved successfully',
    });
  } catch (error) {
    console.error('Error loading staging tax settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load staging tax settings' }, 
      { status: 500 }
    );
  }
}

// POST: Save tax settings to staging (create or update)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Clear existing staging settings and create new ones
    await prisma.taxSettingStaging.deleteMany({});

    const savedSettings = [];
    for (const setting of settings) {
      const savedSetting = await prisma.taxSettingStaging.create({
        data: {
          description: setting.description,
          ratePercent: setting.ratePercent,
          isInclusive: setting.isInclusive,
          isGST: setting.isGST,
        },
      });
      savedSettings.push(savedSetting);
    }

    return NextResponse.json({
      success: true,
      data: savedSettings,
      message: 'Tax settings saved to staging successfully',
    });
  } catch (error) {
    console.error('Error saving tax settings to staging:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save tax settings to staging' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a specific tax setting from staging
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tax setting ID is required' },
        { status: 400 }
      );
    }

    // Check if the tax setting exists
    const existingSetting = await prisma.taxSettingStaging.findUnique({
      where: { id }
    });

    if (!existingSetting) {
      return NextResponse.json(
        { success: false, error: 'Tax setting not found' },
        { status: 404 }
      );
    }

    // Delete the tax setting
    await prisma.taxSettingStaging.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Tax setting removed from staging successfully',
    });
  } catch (error) {
    console.error('Error removing tax setting from staging:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove tax setting from staging' },
      { status: 500 }
    );
  }
}
