import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { userUpdateSchema, validateRequest } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

// PUT /api/admin/users/[id] - Update user role (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const body = await request.json()
    
    // Validate input
    const validation = await validateRequest(userUpdateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        validationErrorResponse(validation.errors),
        { status: 400 }
      )
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!existingUser) {
      return NextResponse.json(notFoundResponse(), { status: 404 })
    }
    
    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: validation.data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(
      successResponse(user, 'User updated successfully')
    )
    
  } catch (error) {
    logger.logApiError('/api/admin/users/[id]', error)
    return NextResponse.json(
      errorResponse('Failed to update user'),
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!existingUser) {
      return NextResponse.json(notFoundResponse(), { status: 404 })
    }
    
    // Prevent admin from deleting themselves
    if (existingUser.role === 'ADMIN') {
      return NextResponse.json(
        errorResponse('Cannot delete admin user'),
        { status: 400 }
      )
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json(
      successResponse(null, 'User deleted successfully')
    )
    
  } catch (error) {
    logger.logApiError('/api/admin/users/[id]', error)
    return NextResponse.json(
      errorResponse('Failed to delete user'),
      { status: 500 }
    )
  }
}
