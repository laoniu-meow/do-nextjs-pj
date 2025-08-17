import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companyUpdateSchema, validateRequest } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

// GET /api/companies/[id] - Get company by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    
    const company = await prisma.company.findUnique({
      where: { id }
    })
    
    if (!company) {
      return NextResponse.json(notFoundResponse(), { status: 404 })
    }
    
    return NextResponse.json(successResponse(company))
  } catch (error) {
    logger.logApiError('/api/companies/[id]', error)
    return NextResponse.json(
      errorResponse('Failed to fetch company'),
      { status: 500 }
    )
  }
}

// PUT /api/companies/[id] - Update company
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const body = await request.json()
    
    // Validate input
    const validation = await validateRequest(companyUpdateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        validationErrorResponse(validation.errors),
        { status: 400 }
      )
    }
    
    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id }
    })
    
    if (!existingCompany) {
      return NextResponse.json(notFoundResponse(), { status: 404 })
    }
    
    // Update company
    const company = await prisma.company.update({
      where: { id },
      data: validation.data
    })
    
    return NextResponse.json(
      successResponse(company, 'Company updated successfully')
    )
    
  } catch (error) {
    logger.logApiError('/api/companies/[id]', error)
    return NextResponse.json(
      errorResponse('Failed to update company'),
      { status: 500 }
    )
  }
}

// DELETE /api/companies/[id] - Delete company
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    
    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id }
    })
    
    if (!existingCompany) {
      return NextResponse.json(notFoundResponse(), { status: 404 })
    }
    
    // Delete company
    await prisma.company.delete({
      where: { id }
    })
    
    return NextResponse.json(
      successResponse(null, 'Company deleted successfully')
    )
    
  } catch (error) {
    logger.logApiError('/api/companies/[id]', error)
    return NextResponse.json(
      errorResponse('Failed to delete company'),
      { status: 500 }
    )
  }
}
