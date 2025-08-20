import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_HEADER_SETTINGS } from '@/features/header-main';

// In-memory storage for demo purposes
// In production, this should be replaced with database storage
let headerSettings = DEFAULT_HEADER_SETTINGS;

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: headerSettings,
      message: 'Header settings retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching header settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch header settings',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        {
          success: false,
          error: 'Settings data is required',
        },
        { status: 400 }
      );
    }

    // Update the stored settings
    headerSettings = { ...headerSettings, ...settings };

    return NextResponse.json({
      success: true,
      settings: headerSettings,
      message: 'Header settings saved successfully',
    });
  } catch (error) {
    console.error('Error saving header settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save header settings',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        {
          success: false,
          error: 'Settings data is required',
        },
        { status: 400 }
      );
    }

    // Update the stored settings
    headerSettings = { ...headerSettings, ...settings };

    return NextResponse.json({
      success: true,
      settings: headerSettings,
      message: 'Header settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating header settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update header settings',
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Reset to default settings
    headerSettings = DEFAULT_HEADER_SETTINGS;

    return NextResponse.json({
      success: true,
      settings: headerSettings,
      message: 'Header settings reset to defaults successfully',
    });
  } catch (error) {
    console.error('Error resetting header settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset header settings',
      },
      { status: 500 }
    );
  }
}
