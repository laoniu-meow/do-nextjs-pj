import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
// Removed unused Prisma types

export const runtime = 'nodejs';

type IncomingSection = {
  id?: string;
  order?: number;
  templateType: 'HERO' | 'INFOGRAPH' | 'CARD_INFO';
  templateData: unknown;
};

function normalizeSections(sections: IncomingSection[]): IncomingSection[] {
  return sections
    .slice(0, 5)
    .map((section, index) => ({
      ...section,
      order: index + 1,
    }));
}

function isValidSection(section: IncomingSection): boolean {
  return (
    !!section &&
    (section.templateType === 'HERO' ||
      section.templateType === 'INFOGRAPH' ||
      section.templateType === 'CARD_INFO') &&
    section.templateData !== undefined
  );
}

// GET - Load hero staging sections
export async function GET() {
  try {
    const model = (prisma as unknown as Record<string, unknown>)[
      'heroSectionStaging'
    ] as
      | {
          findMany?: (args?: unknown) => Promise<unknown[]>;
          create?: (args: unknown) => Promise<unknown>;
          deleteMany?: (args?: unknown) => Promise<{ count: number }>;
        }
      | undefined;
    if (!model || typeof model.findMany !== 'function') {
      return NextResponse.json({
        success: true,
        sections: [],
        message: 'Hero staging model not initialized. Run prisma migrate/generate.',
      });
    }
    const data = await model.findMany?.({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({
      success: true,
      sections: data || [],
      message: 'Hero staging sections retrieved successfully',
    });
  } catch (error) {
    console.error('Error loading hero staging sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load hero staging sections' },
      { status: 500 }
    );
  }
}

// POST - Replace hero staging sections
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections } = body as { sections?: IncomingSection[] };

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { success: false, error: 'Sections array is required' },
        { status: 400 }
      );
    }

    if (sections.length > 5) {
      return NextResponse.json(
        { success: false, error: 'A maximum of 5 sections is allowed' },
        { status: 400 }
      );
    }

    for (const s of sections) {
      if (!isValidSection(s)) {
        return NextResponse.json(
          { success: false, error: 'Invalid section payload' },
          { status: 400 }
        );
      }
    }

    const normalized = normalizeSections(sections);

    const model = (prisma as unknown as Record<string, unknown>)[
      'heroSectionStaging'
    ] as
      | {
          findMany?: (args?: unknown) => Promise<unknown[]>;
          create?: (args: unknown) => Promise<unknown>;
          deleteMany?: (args?: unknown) => Promise<{ count: number }>;
        }
      | undefined;
    if (!model || typeof model.create !== 'function') {
      return NextResponse.json(
        { success: false, error: 'Hero staging model not initialized. Run prisma migrate/generate.' },
        { status: 500 }
      );
    }

    // Replace staging sections sequentially to avoid Prisma transaction typing issues
    await model!.deleteMany?.();
    for (const s of normalized) {
      await model!.create?.({
        data: {
          order: s.order!,
          templateType: s.templateType as unknown as string,
          templateData: s.templateData as unknown,
        },
      });
    }

    const saved = await model!.findMany?.({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      sections: saved || [],
      message: 'Hero staging sections saved successfully',
    });
  } catch (error) {
    console.error('Error saving hero staging sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save hero staging sections' },
      { status: 500 }
    );
  }
}

// DELETE - Clear hero staging sections
export async function DELETE() {
  try {
    const model = (prisma as unknown as Record<string, unknown>)[
      'heroSectionStaging'
    ] as { deleteMany?: (args?: unknown) => Promise<{ count: number }> } | undefined;
    if (!model || typeof model.deleteMany !== 'function') {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'Hero staging model not initialized. Nothing to clear.',
      });
    }
    const result = await model!.deleteMany?.();
    return NextResponse.json({
      success: true,
      count: result?.count ?? 0,
      message: 'Hero staging sections cleared',
    });
  } catch (error) {
    console.error('Error clearing hero staging sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear hero staging sections' },
      { status: 500 }
    );
  }
}


