interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const record = this.store[identifier]

    if (!record || now > record.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs
      }
      return true
    }

    if (record.count >= this.maxRequests) {
      return false
    }

    record.count++
    return true
  }

  getRemaining(identifier: string): number {
    const record = this.store[identifier]
    if (!record) return this.maxRequests
    return Math.max(0, this.maxRequests - record.count)
  }

  getResetTime(identifier: string): number {
    const record = this.store[identifier]
    return record ? record.resetTime : Date.now() + this.windowMs
  }

  cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key]
      }
    })
  }
}

// Create rate limiters for different endpoints
export const authRateLimiter = new RateLimiter(15 * 60 * 1000, 5) // 5 requests per 15 minutes for auth
export const apiRateLimiter = new RateLimiter(15 * 60 * 1000, 100) // 100 requests per 15 minutes for general API
export const uploadRateLimiter = new RateLimiter(60 * 60 * 1000, 10) // 10 uploads per hour

// Cleanup expired records every 5 minutes
setInterval(() => {
  authRateLimiter.cleanup()
  apiRateLimiter.cleanup()
  uploadRateLimiter.cleanup()
}, 5 * 60 * 1000)
