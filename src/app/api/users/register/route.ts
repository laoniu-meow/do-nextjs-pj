import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { userCreateSchema, validateRequest } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = await validateRequest(userCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        validationErrorResponse(validation.errors),
        { status: 400 }
      )
    }
    
    const { email, password, name, role } = validation.data
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        errorResponse('User with this email already exists'),
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    
    return NextResponse.json(
      successResponse(user, 'User created successfully'),
      { status: 201 }
    )
    
  } catch (error) {
    logger.logApiError('/api/users/register', error)
    return NextResponse.json(
      errorResponse('Failed to create user'),
      { status: 500 }
    )
  }
}
