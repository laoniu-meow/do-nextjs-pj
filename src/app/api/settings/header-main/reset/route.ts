import { NextResponse } from 'next/server';
import { DEFAULT_HEADER_SETTINGS } from '@/features/header-main';

// In-memory storage for demo purposes
// In production, this should be replaced with database storage
let headerSettings = DEFAULT_HEADER_SETTINGS;

export async function POST() {
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
