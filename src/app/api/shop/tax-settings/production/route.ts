import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// POST: Move staging tax settings to production
export async function POST() {
  try {
    // Get staging data
    const stagingData = await prisma.taxSettingStaging.findMany({
      orderBy: { description: 'asc' }
    });

    if (stagingData.length === 0) {
      // If no staging data, clear production data (this handles deletions)
      await prisma.taxSetting.deleteMany({});
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Production tax settings cleared (no staging data to upload)',
      });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Clear existing production data
      await tx.taxSetting.deleteMany({});

      // Move staging data to production
      const productionData = [];
      for (const setting of stagingData) {
        const productionSetting = await tx.taxSetting.create({
          data: {
            description: setting.description,
            ratePercent: setting.ratePercent,
            isInclusive: setting.isInclusive,
            isGST: setting.isGST,
          },
        });
        productionData.push(productionSetting);
      }

      // Clear staging data
      await tx.taxSettingStaging.deleteMany({});

      return productionData;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `${result.length} tax setting(s) moved to production successfully`,
    });
  } catch (error) {
    console.error('Error uploading tax settings to production:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload tax settings to production' },
      { status: 500 }
    );
  }
}
