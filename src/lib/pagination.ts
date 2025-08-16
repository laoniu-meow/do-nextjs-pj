import { PAGINATION_CONFIG } from './config'

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function parsePaginationParams(
  pageParam: string | null,
  limitParam: string | null
): PaginationParams {
  const page = Math.max(
    PAGINATION_CONFIG.DEFAULT_PAGE,
    parseInt(pageParam || PAGINATION_CONFIG.DEFAULT_PAGE.toString()) || PAGINATION_CONFIG.DEFAULT_PAGE
  )
  
  const limit = Math.min(
    Math.max(
      PAGINATION_CONFIG.MIN_LIMIT,
      parseInt(limitParam || PAGINATION_CONFIG.DEFAULT_LIMIT.toString()) || PAGINATION_CONFIG.DEFAULT_LIMIT
    ),
    PAGINATION_CONFIG.MAX_LIMIT
  )
  
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

export function createPaginationResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResult<T> {
  const pages = Math.ceil(total / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    }
  }
}
