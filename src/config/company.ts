export const COMPANY_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    ENDPOINTS: {
      COMPANIES: '/companies',
      COMPANY: (id: string) => `/companies/${id}`,
      COMPANY_LOGO: (id: string) => `/companies/${id}/logo`,
    },
    TIMEOUT: 30000, // 30 seconds
  },

  // Validation Rules
  VALIDATION: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100,
      PATTERN: /^[a-zA-Z0-9\s\-&.()]+$/,
    },
    DESCRIPTION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500,
    },
    WEBSITE: {
      PATTERN: /^https?:\/\/.+/,
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    PHONE: {
      PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
    },
  },

  // File Upload Configuration
  UPLOAD: {
    LOGO: {
      MAX_SIZE: 5 * 1024 * 1024, // 5MB
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
      DIMENSIONS: {
        MIN_WIDTH: 200,
        MIN_HEIGHT: 200,
        MAX_WIDTH: 2000,
        MAX_HEIGHT: 2000,
      },
    },
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50,
    PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
  },

  // UI Configuration
  UI: {
    ANIMATIONS: {
      DURATION: 200,
      EASING: 'ease-in-out',
    },
    COLORS: {
      PRIMARY: '#1976d2',
      SUCCESS: '#2e7d32',
      WARNING: '#ed6c02',
      ERROR: '#d32f2f',
    },
  },

  // Feature Flags
  FEATURES: {
    LOGO_UPLOAD: true,
    BULK_OPERATIONS: true,
    EXPORT_FUNCTIONALITY: true,
    ADVANCED_SEARCH: true,
  },
} as const;

export const COMPANY_MESSAGES = {
  SUCCESS: {
    CREATED: 'Company created successfully',
    UPDATED: 'Company updated successfully',
    DELETED: 'Company deleted successfully',
    LOGO_UPLOADED: 'Logo uploaded successfully',
  },
  ERROR: {
    CREATE_FAILED: 'Failed to create company',
    UPDATE_FAILED: 'Failed to update company',
    DELETE_FAILED: 'Failed to delete company',
    FETCH_FAILED: 'Failed to fetch companies',
    LOGO_UPLOAD_FAILED: 'Failed to upload logo',
    VALIDATION_FAILED: 'Please check your input and try again',
  },
  CONFIRMATION: {
    DELETE: 'Are you sure you want to delete this company?',
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  },
} as const;

export const COMPANY_CONSTRAINTS = {
  MAX_COMPANIES_PER_USER: 10,
  MAX_LOGO_SIZE: '5MB',
  SUPPORTED_LOGO_FORMATS: 'JPEG, PNG, WebP',
} as const;
