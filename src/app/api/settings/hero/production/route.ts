import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export const runtime = 'nodejs';

// GET - Load hero production sections
export async function GET() {
  try {
    const model = prisma.heroSectionProduction;
    if (!model || typeof model.findMany !== 'function') {
      return NextResponse.json({
        success: true,
        sections: [],
        message: 'Hero production model not initialized. Run prisma migrate/generate.',
      });
    }
    const data = await model.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({
      success: true,
      sections: data,
      message: 'Hero production sections retrieved successfully',
    });
  } catch (error) {
    console.error('Error loading hero production sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load hero production sections' },
      { status: 500 }
    );
  }
}

// POST - Upload from staging to production (replace all)
export async function POST() {
  try {
    const stagingModel = prisma.heroSectionStaging;
    const prodModel = prisma.heroSectionProduction;
    if (!stagingModel || !prodModel) {
      return NextResponse.json(
        { success: false, error: 'Hero models not initialized. Run prisma migrate/generate.' },
        { status: 500 }
      );
    }
    const staging = await stagingModel.findMany({
      orderBy: { order: 'asc' },
    });

    if (staging.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No staging sections to upload' },
        { status: 400 }
      );
    }

    if (staging.length > 5) {
      return NextResponse.json(
        { success: false, error: 'A maximum of 5 sections is allowed' },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prodModel.deleteMany(),
      ...staging.map((s) =>
        prodModel.create({
          data: {
            order: s.order,
            templateType: s.templateType,
            templateData: s.templateData as Prisma.InputJsonValue,
          },
        })
      ),
    ]);

    const saved = await prodModel.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      sections: saved,
      message: 'Hero sections uploaded to production successfully',
    });
  } catch (error) {
    console.error('Error uploading hero sections to production:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload hero sections to production' },
      { status: 500 }
    );
  }
}


