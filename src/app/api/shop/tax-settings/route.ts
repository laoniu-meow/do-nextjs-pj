import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET: Retrieve all tax settings
export async function GET() {
  try {
    const taxSettings = await prisma.taxSetting.findMany({
      orderBy: { description: 'asc' }
    });
    
    return NextResponse.json({
      success: true,
      data: taxSettings,
      message: 'Tax settings retrieved successfully',
    });
  } catch (error) {
    console.error('Error loading tax settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load tax settings' }, 
      { status: 500 }
    );
  }
}

// POST: Save tax settings (create or update)
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

    // Clear existing settings and create new ones
    await prisma.taxSetting.deleteMany({});

    const savedSettings = [];
    for (const setting of settings) {
      const savedSetting = await prisma.taxSetting.create({
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
      message: 'Tax settings saved successfully',
    });
  } catch (error) {
    console.error('Error saving tax settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save tax settings' },
      { status: 500 }
    );
  }
}
