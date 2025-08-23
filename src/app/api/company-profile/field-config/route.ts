import { NextResponse } from 'next/server';
import { companyFieldConfigService } from '@/services/companyFieldConfig';

export const runtime = 'nodejs';

// GET - Fetch field configuration with staging vs production logic
export async function GET() {
  try {
    const fieldConfig = await companyFieldConfigService.getFieldConfiguration();
    
    if (fieldConfig.success) {
      return NextResponse.json({
        success: true,
        data: fieldConfig.data,
        source: fieldConfig.source,
        message: `Field configuration loaded from ${fieldConfig.source}`
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: fieldConfig.error || 'Failed to load field configuration',
          source: fieldConfig.source
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in field config API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        source: 'default'
      },
      { status: 500 }
    );
  }
}
