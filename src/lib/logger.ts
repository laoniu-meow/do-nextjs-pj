// Secure logging utility - no sensitive data exposure
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

interface LogContext {
  endpoint?: string
  userId?: string
  action?: string
  timestamp: string
}

class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  
  private formatMessage(level: LogLevel, message: string, context?: Partial<LogContext>): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }
  
  info(message: string, context?: Partial<LogContext>): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.INFO, message, context))
    }
    // In production, send to logging service instead
  }
  
  warn(message: string, context?: Partial<LogContext>): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context))
    }
    // In production, send to logging service instead
  }
  
  error(message: string, context?: Partial<LogContext>): void {
    if (this.isDevelopment) {
      console.error(this.formatMessage(LogLevel.ERROR, message, context))
    }
    // In production, send to logging service instead
  }
  
  debug(message: string, context?: Partial<LogContext>): void {
    if (this.isDevelopment && process.env.DEBUG === 'true') {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context))
    }
  }
  
  // Secure error logging - no sensitive data
  logApiError(endpoint: string, error: unknown, userId?: string): void {
    const context: LogContext = {
      endpoint,
      userId,
      action: 'API_ERROR',
      timestamp: new Date().toISOString()
    }
    
    // Only log safe error information
    const safeError = error instanceof Error ? error.message : 'Unknown error'
    this.error(`API Error in ${endpoint}: ${safeError}`, context)
  }
  
  // Secure operation logging
  logOperation(operation: string, success: boolean, context?: Partial<LogContext>): void {
    const message = `${operation} ${success ? 'completed' : 'failed'}`
    this.info(message, context)
  }
}

export const logger = new SecureLogger()
