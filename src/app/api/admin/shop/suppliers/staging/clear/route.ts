import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// DELETE /api/admin/shop/suppliers/staging/clear - clear all staging suppliers
export async function DELETE() {
  try {
    // Delete all staging suppliers
    const result = await prisma.supplierStaging.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `${result.count} staging supplier(s) cleared successfully`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error clearing staging suppliers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear staging suppliers' },
      { status: 500 }
    );
  }
}
