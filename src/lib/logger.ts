// Secure logging utility - no sensitive data exposure
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface LogContext {
  endpoint?: string;
  userId?: string;
  action?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level}: ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.INFO, message, context));
    }
    // In production, send to proper logging service
    // TODO: Implement production logging service integration
  }

  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
    // In production, send to proper logging service
    // TODO: Implement production logging service integration
  }

  error(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.error(this.formatMessage(LogLevel.ERROR, message, context));
    }
    // In production, send to proper logging service
    // TODO: Implement production logging service integration
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
    // In production, debug logging is disabled
  }

  // API-specific error logging method
  logApiError(endpoint: string, error: unknown, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const logContext: LogContext = {
      endpoint,
      error: errorMessage,
      ...context
    };
    
    this.error(`API Error in ${endpoint}: ${errorMessage}`, logContext);
  }
}

// Create and export a default logger instance
export const logger = new Logger();
