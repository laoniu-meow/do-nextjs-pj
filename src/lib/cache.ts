interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private store: Map<string, CacheEntry<unknown>> = new Map()
  private readonly defaultTTL: number = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.store.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    return this.store.has(key)
  }

  delete(key: string): boolean {
    return this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  size(): number {
    return this.store.size
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.store.delete(key)
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; hitRate: number } {
    return {
      size: this.store.size,
      hitRate: 0.8 // Placeholder - implement actual hit rate tracking
    }
  }
}

// Create cache instances for different purposes
export const apiCache = new Cache()
export const userCache = new Cache()
export const contentCache = new Cache()

// Cleanup expired entries every minute
setInterval(() => {
  apiCache.cleanup()
  userCache.cleanup()
  contentCache.cleanup()
}, 60 * 1000)

// Cache decorator for API responses
export function withCache<T>(
  key: string,
  ttl: number = 5 * 60 * 1000
): (fn: () => Promise<T>) => Promise<T> {
  return async (fn: () => Promise<T>): Promise<T> => {
    const cached = apiCache.get<T>(key)
    if (cached) return cached

    const result = await fn()
    apiCache.set(key, result, ttl)
    return result
  }
}
