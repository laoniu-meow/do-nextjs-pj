// Design System - Professional UI Standards
export const designSystem = {
  // Spacing Scale (4px base unit)
  spacing: {
    XS: '4px',
    SM: '8px',
    MD: '16px',
    LG: '24px',
    XL: '32px',
    '2XL': '48px',
    '3XL': '64px',
    '4XL': '80px',
    // Add lowercase keys for backward compatibility
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '80px',
  },

  // Typography
  typography: {
    fontFamily: {
      BASE: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      MONO: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
    },
    fontSize: {
      H1: '2.5rem',
      H2: '2rem',
      H3: '1.5rem',
      H4: '1.25rem',
      H5: '1.125rem',
      H6: '1rem',
      BODY1: '1rem',
      BODY2: '0.875rem',
      CAPTION: '0.75rem',
    },
    lineHeight: {
      H1: '1.2',
      H2: '1.25',
      H3: '1.33',
      H4: '1.4',
      H5: '1.44',
      H6: '1.5',
      BODY1: '1.6',
      BODY2: '1.57',
      CAPTION: '1.5',
    },
    fontWeight: {
      H1: 700,
      H2: 600,
      H3: 600,
      H4: 600,
      H5: 600,
      H6: 600,
      BODY1: 400,
      BODY2: 400,
      CAPTION: 400,
    },
    letterSpacing: {
      H1: '-0.025em',
      H2: '-0.02em',
      H3: '-0.015em',
      H4: '-0.01em',
      H5: '-0.01em',
      H6: '0',
      BODY1: '0.01em',
      BODY2: '0.01em',
      CAPTION: '0.02em',
    },
    // Add the old structure for backward compatibility
    h1: {
      fontSize: '2.5rem',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      lineHeight: '1.25',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      lineHeight: '1.33',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontSize: '1.25rem',
      lineHeight: '1.4',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.125rem',
      lineHeight: '1.44',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '1rem',
      lineHeight: '1.5',
      fontWeight: 600,
      letterSpacing: '0',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: '1.6',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: '1.57',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: '1.5',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
  },

  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Neutral Colors
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },

    // Semantic Colors
    success: {
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    warning: {
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    error: {
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // Background Colors
    background: {
      primary: '#f8fafc', // neutral-50
      secondary: '#f1f5f9', // neutral-100
      tertiary: '#e2e8f0', // neutral-200
    },

    // Surface Colors
    surface: {
      primary: '#ffffff',
      secondary: '#f8fafc', // neutral-50
      tertiary: '#f1f5f9', // neutral-100
      elevated: '#ffffff',
    },

    // Text Colors
    text: {
      primary: '#0f172a', // neutral-900
      secondary: '#475569', // neutral-600
      tertiary: '#64748b', // neutral-500
      disabled: '#94a3b8', // neutral-400
      inverse: '#ffffff',
    },
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
};

// Utility functions
export const getSpacing = (size: keyof typeof designSystem.spacing) =>
  designSystem.spacing[size];

export const getTypography = (variant: keyof typeof designSystem.typography.fontSize) => 
  designSystem.typography.fontSize[variant];

export const getColor = (colorPath: string) => {
  const path = colorPath.split('.');
  let value: unknown = designSystem.colors;
  
  for (const key of path) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      break;
    }
  }
  
  return typeof value === 'string' ? value : designSystem.colors.neutral[500];
};

export const getShadow = (size: keyof typeof designSystem.shadows) =>
  designSystem.shadows[size];

export const getBorderRadius = (size: keyof typeof designSystem.borderRadius) =>
  designSystem.borderRadius[size];

export const getTransition = (speed: keyof typeof designSystem.transitions) =>
  designSystem.transitions[speed];
