import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companyCreateSchema, validateRequest } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

// GET /api/companies - Get all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(successResponse(companies))
  } catch (error) {
    logger.logApiError('/api/companies', error)
    return NextResponse.json(
      errorResponse('Failed to fetch companies'),
      { status: 500 }
    )
  }
}

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = await validateRequest(companyCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        validationErrorResponse(validation.errors),
        { status: 400 }
      )
    }
    
    const companyData = validation.data
    
    // Create company
    const company = await prisma.company.create({
      data: companyData
    })
    
    return NextResponse.json(
      successResponse(company, 'Company created successfully'),
      { status: 201 }
    )
    
  } catch (error) {
    logger.logApiError('/api/companies', error)
    return NextResponse.json(
      errorResponse('Failed to create company'),
      { status: 500 }
    )
  }
}
