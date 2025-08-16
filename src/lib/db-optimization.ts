import { prisma } from './db'

// Optimized database query patterns
export class OptimizedQueries {
  // Batch operations for better performance
  static async batchGetContents(ids: string[]) {
    if (ids.length === 0) return []
    
    // Use IN clause for batch fetching (more efficient than multiple queries)
    return await prisma.content.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        createdAt: true
      }
    })
  }

  // Optimized pagination with cursor-based approach for large datasets
  static async getContentsWithCursor(
    cursor: string | null,
    limit: number,
    where: Record<string, unknown> = {}
  ) {
    return await prisma.content.findMany({
      where,
      take: limit,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: { id: 'asc' },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        createdAt: true
      }
    })
  }

  // Aggregation queries for analytics (single query instead of multiple)
  static async getContentStats() {
    return await prisma.$transaction([
      prisma.content.count(),
      prisma.content.count({ where: { status: 'PUBLISHED' } }),
      prisma.content.count({ where: { status: 'DRAFT' } }),
      prisma.content.groupBy({
        by: ['type'],
        _count: { type: true },
        orderBy: { type: 'asc' }
      })
    ])
  }

  // Optimized search with full-text search capabilities
  static async searchContents(query: string, limit: number = 10) {
    return await prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        createdAt: true
      }
    })
  }
}

// Connection pooling and health check
export const checkDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
