import { useMemo } from 'react';
import { 
  SPACING, 
  COLORS, 
  TYPOGRAPHY, 
  BORDER_RADIUS, 
  SHADOWS, 
  TRANSITIONS,
  BREAKPOINTS,
  Z_INDEX,
  SIZES 
} from '../constants/theme';

/**
 * Custom hook that provides access to design system values and utilities
 * This hook ensures consistency between CSS custom properties and TypeScript values
 */
export const useDesignSystem = () => {
  const designSystemValues = useMemo(() => ({
    // Spacing
    spacing: SPACING,
    
    // Colors
    colors: COLORS,
    
    // Typography
    typography: TYPOGRAPHY,
    
    // Border Radius
    borderRadius: BORDER_RADIUS,
    
    // Shadows
    shadows: SHADOWS,
    
    // Transitions
    transitions: TRANSITIONS,
    
    // Breakpoints
    breakpoints: BREAKPOINTS,
    
    // Z-Index
    zIndex: Z_INDEX,
    
    // Component Sizes
    sizes: SIZES,
    
    // Utility functions
    getSpacing: (size: keyof typeof SPACING) => SPACING[size],
    getColor: (colorPath: string) => {
      const path = colorPath.split('.');
      let value: unknown = COLORS;
      
      for (const key of path) {
        if (typeof value === 'object' && value !== null && key in value) {
          value = (value as Record<string, unknown>)[key];
        } else {
          break;
        }
      }
      
      return typeof value === 'string' ? value : COLORS.NEUTRAL[500];
    },
    getShadow: (size: keyof typeof SHADOWS) => SHADOWS[size],
    getBorderRadius: (size: keyof typeof BORDER_RADIUS) => BORDER_RADIUS[size],
    getTransition: (speed: keyof typeof TRANSITIONS) => TRANSITIONS[speed],
    getTypography: (variant: keyof typeof TYPOGRAPHY.FONT_SIZE) => TYPOGRAPHY.FONT_SIZE[variant],
    
    // CSS Custom Properties (for use in styled-components or inline styles)
    cssVars: {
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
        '4xl': 'var(--spacing-4xl)',
      },
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        success: {
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
        },
        warning: {
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
        },
        error: {
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
        },
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },
      shadows: {
        none: 'var(--shadow-none)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      transitions: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
      },
      fontFamily: {
        base: 'var(--font-family-base)',
        mono: 'var(--font-family-mono)',
      },
    },
  }), []);

  return designSystemValues;
};

// Export individual hooks for specific use cases
export const useSpacing = () => SPACING;
export const useColors = () => COLORS;
export const useTypography = () => TYPOGRAPHY;
export const useBorderRadius = () => BORDER_RADIUS;
export const useShadows = () => SHADOWS;
export const useTransitions = () => TRANSITIONS;
export const useBreakpoints = () => BREAKPOINTS;
export const useZIndex = () => Z_INDEX;
export const useSizes = () => SIZES;
