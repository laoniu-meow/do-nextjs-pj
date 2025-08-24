import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// POST: Publish staging tax settings to production
export async function POST() {
  try {
    // Get all staging tax settings
    const stagingSettings = await prisma.taxSettingStaging.findMany();
    
    if (stagingSettings.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No staging tax settings to publish',
      }, { status: 400 });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Clear existing production settings
      await tx.taxSetting.deleteMany({});

      // Create new production settings from staging
      const publishedSettings = [];
      for (const stagingSetting of stagingSettings) {
        const publishedSetting = await tx.taxSetting.create({
          data: {
            description: stagingSetting.description,
            ratePercent: stagingSetting.ratePercent,
            isInclusive: stagingSetting.isInclusive,
            isGST: stagingSetting.isGST,
          },
        });
        publishedSettings.push(publishedSetting);
      }

      // Clear staging settings after successful publish
      await tx.taxSettingStaging.deleteMany({});

      return publishedSettings;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Tax settings published to production successfully',
    });
  } catch (error) {
    console.error('Error publishing tax settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish tax settings' },
      { status: 500 }
    );
  }
}
