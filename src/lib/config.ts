export const config = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    retryAttempts: 3,
  },

  // Security Configuration
  security: {
    // Rate limiting
    authRateLimit: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    apiRateLimit: {
      maxAttempts: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.NODE_ENV === 'development',
    enableFile: process.env.NODE_ENV === 'production',
    logFile: process.env.LOG_FILE || 'logs/app.log',
  },

  // Feature Flags
  features: {
    enableDebugMode: process.env.NODE_ENV === 'development',
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableErrorReporting: process.env.NODE_ENV === 'production',
  },
} as const;

// Legacy constants for backward compatibility
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
} as const;

export const ORDERING_CONFIG = {
  DEFAULT_FIELD: 'createdAt',
  DEFAULT_DIRECTION: 'desc',
  ALLOWED_FIELDS: ['createdAt', 'updatedAt', 'title', 'type', 'status'] as const,
  ALLOWED_DIRECTIONS: ['asc', 'desc'] as const
} as const;

export const API_MESSAGES = {
  CONTENTS: {
    FETCH_SUCCESS: 'Contents fetched successfully',
    FETCH_ERROR: 'Failed to fetch contents',
    CREATE_SUCCESS: 'Content created successfully',
    CREATE_ERROR: 'Failed to create content',
    UPDATE_SUCCESS: 'Content updated successfully',
    UPDATE_ERROR: 'Failed to update content',
    DELETE_SUCCESS: 'Content deleted successfully',
    DELETE_ERROR: 'Failed to delete content',
    NOT_FOUND: 'Content not found'
  },
  VALIDATION: {
    INVALID_PAGE: 'Invalid page number',
    INVALID_LIMIT: 'Invalid limit value',
    INVALID_ORDER_FIELD: 'Invalid ordering field',
    INVALID_ORDER_DIRECTION: 'Invalid ordering direction'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Type-safe config access
export type Config = typeof config;
export type ApiConfig = Config['api'];
export type SecurityConfig = Config['security'];
export type LoggingConfig = Config['logging'];
export type FeatureFlags = Config['features'];
