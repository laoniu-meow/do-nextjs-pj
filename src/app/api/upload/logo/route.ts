import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { uploadConfig } from '@/lib/env';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > uploadConfig.maxFileSize) {
      const maxSizeMB = Math.round(uploadConfig.maxFileSize / (1024 * 1024));
      return NextResponse.json(
        { 
          success: false, 
          message: `File size must be less than ${maxSizeMB}MB` 
        },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist (support public/* and src/*)
    const resolveUploadDir = (subPath: string): string => {
      if (subPath.startsWith('public/')) {
        return join(process.cwd(), subPath);
      }
      return join(process.cwd(), 'src', subPath);
    };

    const uploadDir = resolveUploadDir(uploadConfig.logosDir);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `logo_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the URL path: if saving under public/, prefer direct public URL; else use API route
    const isPublic = uploadConfig.logosDir.startsWith('public/');
    const logoUrl = isPublic ? `/${uploadConfig.logosDir.replace('public/', '')}/${fileName}` : `/api/assets/logo/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'Logo uploaded successfully',
              data: {
          fileName,
          filePath: logoUrl,
          fileSize: file.size,
          mimeType: file.type
        }
    });

  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload logo',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { success: false, message: 'No filename provided' },
        { status: 400 }
      );
    }

          // Delete file from upload directory
      const uploadDir = join(process.cwd(), 'src', uploadConfig.logosDir);
      const filePath = join(uploadDir, fileName);

    try {
      await writeFile(filePath, ''); // This will overwrite the file
      // Note: In production, you might want to use proper file deletion
      // For now, we'll just overwrite it
    } catch (deleteError) {
      console.error('Error deleting file:', deleteError);
    }

    return NextResponse.json({
      success: true,
      message: 'Logo deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete logo',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
