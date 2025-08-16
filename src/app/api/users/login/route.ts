import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { comparePassword, generateToken } from '@/lib/auth'
import { userLoginSchema, validateRequest } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = await validateRequest(userLoginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        validationErrorResponse(validation.errors),
        { status: 400 }
      )
    }
    
    const { email, password } = validation.data
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json(
        errorResponse('Invalid credentials'),
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        errorResponse('Invalid credentials'),
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })
    
    // Return user data and token
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
    
    return NextResponse.json(
      successResponse({
        user: userData,
        token
      }, 'Login successful')
    )
    
  } catch (error) {
    logger.logApiError('/api/users/login', error)
    return NextResponse.json(
      errorResponse('Failed to login'),
      { status: 500 }
    )
  }
}
