import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { uploadConfig } from '@/lib/env';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    if (!filename) {
      return NextResponse.json(
        { success: false, message: 'No filename provided' },
        { status: 400 }
      );
    }

    // Construct the file path
    const filePath = join(process.cwd(), 'src', uploadConfig.logosDir, filename);
    
    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'image/png'; // default
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }

    // Return the file with appropriate headers
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error serving logo file:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Logo file not found',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 404 }
    );
  }
}
