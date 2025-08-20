import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET - Load staging data
export async function GET() {
  try {
    const stagingData = await prisma.headerSettingsStaging.findMany({
      orderBy: { createdAt: "asc" },
    });
    
    return NextResponse.json({ 
      success: true, 
      data: stagingData,
      message: 'Header settings staging data retrieved successfully'
    });
  } catch (error) {
    console.error("Error loading header settings staging data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load staging data" },
      { status: 500 }
    );
  }
}

// POST - Save data to staging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { success: false, error: "Settings data is required" },
        { status: 400 }
      );
    }

    // Clear existing staging data
    await prisma.headerSettingsStaging.deleteMany();

    // Insert new staging data
    const stagingData = await prisma.headerSettingsStaging.create({
      data: {
        // Desktop settings
        desktopHeight: settings.desktop.height,
        desktopPaddingHorizontal: settings.desktop.paddingHorizontal,
        desktopLogoWidth: settings.desktop.logoWidth,
        desktopLogoHeight: settings.desktop.logoHeight,
        desktopQuickButtonSize: settings.desktop.quickButtonSize,
        desktopMenuButtonSize: settings.desktop.menuButtonSize,
        
        // Tablet settings
        tabletHeight: settings.tablet.height,
        tabletPaddingHorizontal: settings.tablet.paddingHorizontal,
        tabletLogoWidth: settings.tablet.logoWidth,
        tabletLogoHeight: settings.tablet.logoHeight,
        tabletQuickButtonSize: settings.tablet.quickButtonSize,
        tabletMenuButtonSize: settings.tablet.menuButtonSize,
        
        // Mobile settings
        mobileHeight: settings.mobile.height,
        mobilePaddingHorizontal: settings.mobile.paddingHorizontal,
        mobileLogoWidth: settings.mobile.logoWidth,
        mobileLogoHeight: settings.mobile.logoHeight,
        mobileQuickButtonSize: settings.mobile.quickButtonSize,
        mobileMenuButtonSize: settings.mobile.menuButtonSize,
        
        // Global settings
        backgroundColor: settings.backgroundColor,
        pageBackgroundColor: settings.backgroundColor, // Using same as background
        dropShadow: settings.dropShadow.toUpperCase(),
        quickButtonBgColor: settings.quickButtonBgColor,
        quickButtonIconColor: settings.quickButtonIconColor,
        quickButtonHoverBgColor: settings.quickButtonHoverBgColor,
        quickButtonHoverIconColor: settings.quickButtonHoverIconColor,
        quickButtonShape: settings.quickButtonShape.toUpperCase(),
        quickButtonShadow: settings.quickButtonShadow.toUpperCase(),
        quickButtonGap: settings.quickButtonGap,
        menuButtonBgColor: settings.menuButtonBgColor,
        menuButtonIconColor: settings.menuButtonIconColor,
        menuButtonHoverBgColor: settings.menuButtonHoverBgColor,
        menuButtonHoverIconColor: settings.menuButtonHoverIconColor,
        menuButtonIconId: settings.menuButtonIconId,
        menuButtonShape: settings.menuButtonShape.toUpperCase(),
        menuButtonShadow: settings.menuButtonShadow.toUpperCase(),
        
        // Metadata
        name: "Header Settings",
        isActive: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Header settings saved to staging",
      data: stagingData
    });
  } catch (error) {
    console.error("Error saving to staging:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save to staging" },
      { status: 500 }
    );
  }
}

// DELETE - Remove staging data
export async function DELETE() {
  try {
    // Clear all staging data
    const deletedCount = await prisma.headerSettingsStaging.deleteMany();

    return NextResponse.json({ 
      success: true, 
      message: "Staging data cleared successfully",
      count: deletedCount.count
    });
  } catch (error) {
    console.error("Error clearing staging data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear staging data" },
      { status: 500 }
    );
  }
}
