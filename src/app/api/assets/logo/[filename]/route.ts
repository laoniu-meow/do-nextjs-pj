import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { uploadConfig } from '@/lib/env';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    if (!filename || /\.\./.test(filename)) {
      return NextResponse.json(
        { success: false, message: 'Invalid filename' },
        { status: 400 }
      );
    }

    // Construct the file path, supporting both src/* and public/* based on env setting
    const resolveLogosDir = (subPath: string): string => {
      // If configured under public/, do not prefix with src
      if (subPath.startsWith('public/')) {
        return join(process.cwd(), subPath);
      }
      // Default to src/* structure
      return join(process.cwd(), 'src', subPath);
    };

    const filePath = join(resolveLogosDir(uploadConfig.logosDir), filename);
    await stat(filePath) // ensure exists
    
    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'image/png';
    
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
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
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
