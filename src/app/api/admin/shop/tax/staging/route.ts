import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET: Retrieve all staging tax settings
export async function GET() {
  try {
    const allStagingSettings = await prisma.taxSettingStaging.findMany({
      orderBy: { description: 'asc' }
    });
    
    // Separate active and deleted rules
    const activeRules = allStagingSettings.filter(setting => !setting.isDeleted);
    const deletedRules = allStagingSettings.filter(setting => setting.isDeleted);
    
    return NextResponse.json({
      success: true,
      data: activeRules,
      deletedRules: deletedRules,
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
    const { rules } = body;

    if (!Array.isArray(rules)) {
      return NextResponse.json(
        { success: false, error: 'Invalid rules data' },
        { status: 400 }
      );
    }

    // Clear existing staging settings and create new ones
    await prisma.taxSettingStaging.deleteMany({});

    const savedSettings = [];
    for (const rule of rules) {
      const savedSetting = await prisma.taxSettingStaging.create({
        data: {
          description: typeof rule.description === 'string' ? rule.description : 'Untitled Tax Rule',
          ratePercent: String(rule.ratePercent), // Convert number to string for database
          isInclusive: Boolean(rule.isInclusive),
          isGST: Boolean(rule.isGST),
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

// PUT: Update staging tax settings (bulk replace)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { rules, deletedRules = [] } = body;

    if (!Array.isArray(rules)) {
      return NextResponse.json(
        { success: false, error: 'Invalid rules data' },
        { status: 400 }
      );
    }

    if (!Array.isArray(deletedRules)) {
      return NextResponse.json(
        { success: false, error: 'Invalid deleted rules data' },
        { status: 400 }
      );
    }

    // Clear existing staging settings and create new ones
    await prisma.taxSettingStaging.deleteMany({});

    const savedSettings = [];
    for (const rule of rules) {
      const savedSetting = await prisma.taxSettingStaging.create({
        data: {
          description: typeof rule.description === 'string' ? rule.description : 'Untitled Tax Rule',
          ratePercent: String(rule.ratePercent), // Convert number to string for database
          isInclusive: Boolean(rule.isInclusive),
          isGST: Boolean(rule.isGST),
          isDeleted: false, // Mark as active
        },
      });
      savedSettings.push(savedSetting);
    }

    // Store deleted rules metadata in staging (for restoration purposes)
    const deletedRulesMetadata = deletedRules.map((rule: Record<string, unknown>) => ({
      description: typeof rule.description === 'string' ? rule.description : 'Deleted Tax Rule',
      ratePercent: String(rule.ratePercent),
      isInclusive: Boolean(rule.isInclusive),
      isGST: Boolean(rule.isGST),
      isDeleted: true, // Mark as deleted
    }));

    // Store deleted rules in staging table with isDeleted flag
    for (const deletedRule of deletedRulesMetadata) {
      await prisma.taxSettingStaging.create({
        data: {
          description: deletedRule.description || 'Deleted Tax Rule',
          ratePercent: deletedRule.ratePercent,
          isInclusive: deletedRule.isInclusive,
          isGST: deletedRule.isGST,
          isDeleted: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: savedSettings,
      deletedRules: deletedRulesMetadata,
      message: 'Staging tax settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating staging tax settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staging tax settings' },
      { status: 500 }
    );
  }
}

// DELETE: Clear all staging tax settings
export async function DELETE() {
  try {
    const result = await prisma.taxSettingStaging.deleteMany({});
    return NextResponse.json({
      success: true,
      count: result.count,
      message: 'All staging tax settings cleared',
    });
  } catch (error) {
    console.error('Error clearing staging tax settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear staging tax settings' },
      { status: 500 }
    );
  }
}
