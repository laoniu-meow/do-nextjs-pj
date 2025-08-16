import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { contentCreateSchema, validateRequest } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { parsePaginationParams, createPaginationResult } from '@/lib/pagination'
import { parseOrderingParams, createOrderByClause } from '@/lib/ordering'
import { parseContentFilters, createWhereClause } from '@/lib/filtering'
import { API_MESSAGES, HTTP_STATUS } from '@/lib/config'
import { logger } from '@/lib/logger'

// GET /api/contents - Get all contents with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse all parameters using reusable utilities
    const pagination = parsePaginationParams(
      searchParams.get('page'),
      searchParams.get('limit')
    )
    
    const ordering = parseOrderingParams(
      searchParams.get('orderBy'),
      searchParams.get('orderDirection')
    )
    
    const filters = parseContentFilters(searchParams)
    
    // Create where clause using reusable utility
    const where = createWhereClause(filters)
    
    // Create order by clause using reusable utility
    const orderBy = createOrderByClause(ordering.field, ordering.direction)
    
    // Use optimized query with field selection for better performance
    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.limit,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.content.count({ where })
    ])
    
    // Create pagination result using reusable utility
    const result = createPaginationResult(
      contents,
      total,
      pagination.page,
      pagination.limit
    )
    
    return NextResponse.json(
      successResponse(result, API_MESSAGES.CONTENTS.FETCH_SUCCESS),
      { status: HTTP_STATUS.OK }
    )
  } catch (error) {
    logger.logApiError('/api/contents', error)
    return NextResponse.json(
      errorResponse(API_MESSAGES.CONTENTS.FETCH_ERROR),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}

// POST /api/contents - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = await validateRequest(contentCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        validationErrorResponse(validation.errors),
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }
    
    const contentData = validation.data
    
    // Create content
    const content = await prisma.content.create({
      data: contentData,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(
      successResponse(content, API_MESSAGES.CONTENTS.CREATE_SUCCESS),
      { status: HTTP_STATUS.CREATED }
    )
    
  } catch (error) {
    logger.logApiError('/api/contents', error)
    return NextResponse.json(
      errorResponse(API_MESSAGES.CONTENTS.CREATE_ERROR),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}
