import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { contentUpdateSchema, validateRequest } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

// GET /api/contents/[id] - Get content by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    
    const content = await prisma.content.findUnique({
      where: { id }
    })
    
    if (!content) {
      return NextResponse.json(notFoundResponse(), { status: 404 })
    }
    
    return NextResponse.json(successResponse(content))
  } catch (error) {
    logger.logApiError('/api/contents/[id]', error)
    return NextResponse.json(
      errorResponse('Failed to fetch content'),
      { status: 500 }
    )
  }
}

// PUT /api/contents/[id] - Update content
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const body = await request.json()
    
    // Validate input
    const validation = await validateRequest(contentUpdateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        validationErrorResponse(validation.errors),
        { status: 400 }
      )
    }
    
    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id }
    })
    
    if (!existingContent) {
      return NextResponse.json(notFoundResponse(), { status: 404 })
    }
    
    // Update content
    const content = await prisma.content.update({
      where: { id },
      data: validation.data
    })
    
    return NextResponse.json(
      successResponse(content, 'Content updated successfully')
    )
    
  } catch (error) {
    logger.logApiError('/api/contents/[id]', error)
    return NextResponse.json(
      errorResponse('Failed to update content'),
      { status: 500 }
    )
  }
}

// DELETE /api/contents/[id] - Delete content
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    
    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id }
    })
    
    if (!existingContent) {
      return NextResponse.json(notFoundResponse(), { status: 404 })
    }
    
    // Delete content
    await prisma.content.delete({
      where: { id }
    })
    
    return NextResponse.json(
      successResponse(null, 'Content deleted successfully')
    )
    
  } catch (error) {
    logger.logApiError('/api/contents/[id]', error)
    return NextResponse.json(
      errorResponse('Failed to delete content'),
      { status: 500 }
    )
  }
}
