// Design System - Professional UI Standards
export const designSystem = {
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    SM: "0.5rem",
    MD: "1rem",
    LG: "1.5rem",
    XL: "2rem",
    "2XL": "3rem",
    XS: "0.5rem",
  },
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
      tertiary: "#9ca3af",
      inverse: "#ffffff",
      disabled: "#9ca3af",
    },
    surface: {
      primary: "#ffffff",
      secondary: "#f9fafb",
      tertiary: "#f3f4f6",
    },
    background: {
      primary: "#f9fafb",
      secondary: "#f3f4f6",
      tertiary: "#e5e7eb",
    },
    success: {
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
    },
    warning: {
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
    },
    error: {
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
    },
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
  typography: {
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 400,
    },
    h1: {
      fontSize: "2.5rem",
      lineHeight: 1.2,
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      lineHeight: 1.3,
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.5rem",
      lineHeight: 1.4,
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.25rem",
      lineHeight: 1.4,
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.125rem",
      lineHeight: 1.4,
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      lineHeight: 1.4,
      fontWeight: 600,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      fontWeight: 400,
    },
    fontFamily: {
      BASE: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      MONO: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
    },
    fontSize: {
      H1: "2.5rem",
      H2: "2rem",
      H3: "1.5rem",
      H4: "1.25rem",
      H5: "1.125rem",
      H6: "1rem",
      BODY1: "1rem",
      BODY2: "0.875rem",
      CAPTION: "0.75rem",
    },
  },
  transitions: {
    fast: "0.15s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
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
