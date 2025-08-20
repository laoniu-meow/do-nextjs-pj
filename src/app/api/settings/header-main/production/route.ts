import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET - Load production data
export async function GET() {
  try {
    const productionData = await prisma.headerSettingsProduction.findMany({
      orderBy: { createdAt: "asc" },
    });
    
    return NextResponse.json({ 
      success: true, 
      data: productionData,
      message: 'Header settings production data retrieved successfully'
    });
  } catch (error) {
    console.error("Error loading header settings production data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load production data" },
      { status: 500 }
    );
  }
}

// POST - Move data from staging to production
export async function POST() {
  try {
    // Get staging data
    const stagingData = await prisma.headerSettingsStaging.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (stagingData.length === 0) {
      return NextResponse.json(
        { success: false, error: "No staging data to upload" },
        { status: 400 }
      );
    }

    // Clear existing production data
    await prisma.headerSettingsProduction.deleteMany();

    // Insert staging data into production
    const productionData = await prisma.headerSettingsProduction.create({
      data: {
        // Desktop settings
        desktopHeight: stagingData[0].desktopHeight,
        desktopPaddingHorizontal: stagingData[0].desktopPaddingHorizontal,
        desktopLogoWidth: stagingData[0].desktopLogoWidth,
        desktopLogoHeight: stagingData[0].desktopLogoHeight,
        desktopQuickButtonSize: stagingData[0].desktopQuickButtonSize,
        desktopMenuButtonSize: stagingData[0].desktopMenuButtonSize,
        
        // Tablet settings
        tabletHeight: stagingData[0].tabletHeight,
        tabletPaddingHorizontal: stagingData[0].tabletPaddingHorizontal,
        tabletLogoWidth: stagingData[0].tabletLogoWidth,
        tabletLogoHeight: stagingData[0].tabletLogoHeight,
        tabletQuickButtonSize: stagingData[0].tabletQuickButtonSize,
        tabletMenuButtonSize: stagingData[0].tabletMenuButtonSize,
        
        // Mobile settings
        mobileHeight: stagingData[0].mobileHeight,
        mobilePaddingHorizontal: stagingData[0].mobilePaddingHorizontal,
        mobileLogoWidth: stagingData[0].mobileLogoWidth,
        mobileLogoHeight: stagingData[0].mobileLogoHeight,
        mobileQuickButtonSize: stagingData[0].mobileQuickButtonSize,
        mobileMenuButtonSize: stagingData[0].mobileMenuButtonSize,
        
        // Global settings
        backgroundColor: stagingData[0].backgroundColor,
        pageBackgroundColor: stagingData[0].pageBackgroundColor,
        dropShadow: stagingData[0].dropShadow,
        quickButtonBgColor: stagingData[0].quickButtonBgColor,
        quickButtonIconColor: stagingData[0].quickButtonIconColor,
        quickButtonHoverBgColor: stagingData[0].quickButtonHoverBgColor,
        quickButtonHoverIconColor: stagingData[0].quickButtonHoverIconColor,
        quickButtonShape: stagingData[0].quickButtonShape,
        quickButtonShadow: stagingData[0].quickButtonShadow,
        quickButtonGap: stagingData[0].quickButtonGap,
        menuButtonBgColor: stagingData[0].menuButtonBgColor,
        menuButtonIconColor: stagingData[0].menuButtonIconColor,
        menuButtonHoverBgColor: stagingData[0].menuButtonHoverBgColor,
        menuButtonHoverIconColor: stagingData[0].menuButtonHoverIconColor,
        menuButtonIconId: stagingData[0].menuButtonIconId,
        menuButtonShape: stagingData[0].menuButtonShape,
        menuButtonShadow: stagingData[0].menuButtonShadow,
        
        // Metadata
        name: "Header Settings",
        isActive: true,
      },
    });

    // Clear staging data after successful upload
    await prisma.headerSettingsStaging.deleteMany();

    return NextResponse.json({ 
      success: true, 
      message: "Header settings uploaded to production",
      data: productionData
    });
  } catch (error) {
    console.error("Error uploading to production:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload to production" },
      { status: 500 }
    );
  }
}

// DELETE - Remove production data
export async function DELETE() {
  try {
    // Clear all production data
    const deletedCount = await prisma.headerSettingsProduction.deleteMany();

    return NextResponse.json({ 
      success: true, 
      message: "Production data cleared successfully",
      count: deletedCount.count
    });
  } catch (error) {
    console.error("Error clearing production data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear production data" },
      { status: 500 }
    );
  }
}
