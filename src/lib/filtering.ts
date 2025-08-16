import { ContentType, Status } from '@prisma/client'

export interface ContentFilters {
  type?: ContentType
  status?: Status
  search?: string
}

export function parseContentFilters(searchParams: URLSearchParams): ContentFilters {
  const filters: ContentFilters = {}
  
  // Parse type filter
  const typeParam = searchParams.get('type')
  if (typeParam && Object.values(ContentType).includes(typeParam as ContentType)) {
    filters.type = typeParam as ContentType
  }
  
  // Parse status filter
  const statusParam = searchParams.get('status')
  if (statusParam && Object.values(Status).includes(statusParam as Status)) {
    filters.status = statusParam as Status
  }
  
  // Parse search filter
  const searchParam = searchParams.get('search')
  if (searchParam && searchParam.trim().length > 0) {
    filters.search = searchParam.trim()
  }
  
  return filters
}

export function createWhereClause(filters: ContentFilters) {
  const where: Record<string, unknown> = {}
  
  // Add type filter
  if (filters.type) {
    where.type = filters.type
  }
  
  // Add status filter
  if (filters.status) {
    where.status = filters.status
  }
  
  // Add search filter (search in title and content)
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } }
    ]
  }
  
  return where
}
