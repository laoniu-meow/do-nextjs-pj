// Theme Constants - Design System Values
// This file exports all the design system values as constants for easy access

// Spacing Scale
export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
  '2XL': '48px',
  '3XL': '64px',
  '4XL': '80px',
} as const;

// Responsive Spacing
export const RESPONSIVE_SPACING = {
  xs: { mobile: '4px', tablet: '8px', desktop: '12px' },
  sm: { mobile: '8px', tablet: '12px', desktop: '16px' },
  md: { mobile: '16px', tablet: '24px', desktop: '32px' },
  lg: { mobile: '24px', tablet: '32px', desktop: '48px' },
  xl: { mobile: '32px', tablet: '48px', desktop: '64px' },
  xxl: { mobile: '48px', tablet: '64px', desktop: '96px' }
} as const;

// Color Palette
export const COLORS = {
  // Primary Colors
  PRIMARY: {
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
  NEUTRAL: {
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
  SUCCESS: {
    500: '#22c55e',
    600: '#16a34a',
  },
  
  WARNING: {
    500: '#f59e0b',
    600: '#d97706',
  },
  
  ERROR: {
    500: '#ef4444',
    600: '#dc2626',
  },

  // Background Colors
  BACKGROUND: {
    PRIMARY: '#f8fafc',
    SECONDARY: '#f1f5f9',
    TERTIARY: '#e2e8f0',
  },

  // Surface Colors
  SURFACE: {
    PRIMARY: '#ffffff',
    SECONDARY: '#f8fafc',
    TERTIARY: '#f1f5f9',
    ELEVATED: '#ffffff',
  },

  // Text Colors
  TEXT: {
    PRIMARY: '#0f172a',
    SECONDARY: '#475569',
    TERTIARY: '#64748b',
    DISABLED: '#94a3b8',
    INVERSE: '#ffffff',
  },
} as const;

// Typography
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    BASE: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    MONO: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
  },
  FONT_SIZE: {
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
  LINE_HEIGHT: {
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
  FONT_WEIGHT: {
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
  LETTER_SPACING: {
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
} as const;

// Responsive Typography
export const RESPONSIVE_TYPOGRAPHY = {
  h1: { mobile: '24px', tablet: '32px', desktop: '48px' },
  h2: { mobile: '20px', tablet: '28px', desktop: '36px' },
  h3: { mobile: '18px', tablet: '24px', desktop: '28px' },
  h4: { mobile: '16px', tablet: '20px', desktop: '24px' },
  h5: { mobile: '14px', tablet: '18px', desktop: '20px' },
  h6: { mobile: '12px', tablet: '16px', desktop: '18px' },
  body: { mobile: '14px', tablet: '16px', desktop: '18px' },
  small: { mobile: '12px', tablet: '14px', desktop: '16px' },
  caption: { mobile: '12px', tablet: '14px', desktop: '16px' }
} as const;

// Border Radius
export const BORDER_RADIUS = {
  NONE: '0',
  SM: '4px',
  MD: '8px',
  LG: '12px',
  XL: '16px',
  '2XL': '20px',
  '3XL': '24px',
  FULL: '9999px',
} as const;

// Shadows
export const SHADOWS = {
  NONE: 'none',
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

// Transitions
export const TRANSITIONS = {
  FAST: '150ms ease-in-out',
  NORMAL: '200ms ease-in-out',
  SLOW: '300ms ease-in-out',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: '640px',
  TABLET: '768px',
  DESKTOP: '1024px',
  LARGE_DESKTOP: '1280px',
} as const;

// Z-Index Scale
export const Z_INDEX = {
  HIDE: -1,
  AUTO: 'auto',
  BASE: 0,
  DOCKED: 10,
  DROPDOWN: 1000,
  STICKY: 1100,
  BANNER: 1200,
  OVERLAY: 1300,
  MODAL: 1400,
  POPOVER: 1500,
  SKIP_LINK: 1600,
  TOAST: 1700,
  TOOLTIP: 1800,
} as const;

// Common component sizes
export const SIZES = {
  ICON: {
    SM: '16px',
    MD: '20px',
    LG: '24px',
    XL: '32px',
    '2XL': '40px',
  },
  BUTTON: {
    SM: '32px',
    MD: '40px',
    LG: '48px',
    XL: '56px',
  },
  INPUT: {
    SM: '32px',
    MD: '40px',
    LG: '48px',
    XL: '56px',
  },
} as const;

// Admin Menu Theme Configuration
export const ADMIN_MENU_THEME = {
  button: {
    size: 56,
    borderRadius: '50%',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    hoverBackgroundColor: '#f9fafb',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  positioning: {
    top: 16,
    right: 16,
    zIndex: 9999,
    menuTopOffset: 8,
  },
  drawer: {
    width: {
      xs: '100%',
      sm: 320,
      md: 400,
    },
    maxWidth: '100vw',
  },
  menu: {
    maxWidth: 320,
    topMargin: 8,
  },
  colors: {
    primary: 'primary.main',
    error: 'error.main',
    default: 'text.primary',
  },
} as const;

// Export all as a single object for convenience
export const THEME_CONSTANTS = {
  SPACING,
  RESPONSIVE_SPACING,
  COLORS,
  TYPOGRAPHY,
  RESPONSIVE_TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
  BREAKPOINTS,
  Z_INDEX,
  SIZES,
  ADMIN_MENU_THEME,
} as const;
