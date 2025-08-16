export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

export function errorResponse(message: string, errors?: string[]): ApiResponse {
  return {
    success: false,
    message,
    errors
  }
}

export function validationErrorResponse(errors: string[]): ApiResponse {
  return {
    success: false,
    message: 'Validation failed',
    errors
  }
}

export function unauthorizedResponse(): ApiResponse {
  return {
    success: false,
    message: 'Unauthorized'
  }
}

export function forbiddenResponse(): ApiResponse {
  return {
    success: false,
    message: 'Forbidden'
  }
}

export function notFoundResponse(): ApiResponse {
  return {
    success: false,
    message: 'Resource not found'
  }
}

export function serverErrorResponse(): ApiResponse {
  return {
    success: false,
    message: 'Internal server error'
  }
}
