/* eslint-disable security/detect-object-injection */
import { 
  SPACING, 
  COLORS, 
  TYPOGRAPHY, 
  BORDER_RADIUS, 
  SHADOWS, 
  TRANSITIONS,
  BREAKPOINTS,
  SIZES 
} from '../components/ui/constants/theme';

/**
 * Design System Utility Functions
 * These functions provide common patterns and helpers for working with design system values
 */

// Spacing utilities
export const createSpacing = (multiplier: number) => {
  const baseSpacing = 4; // 4px base unit
  return `${baseSpacing * multiplier}px`;
};

export const getResponsiveSpacing = (size: keyof typeof SPACING) => {
  const spacingValue = SPACING[size];
  const numericValue = parseInt(spacingValue);
  
  return {
    mobile: `${numericValue * 0.75}px`,
    tablet: spacingValue,
    desktop: `${numericValue * 1.25}px`,
    largeDesktop: `${numericValue * 1.5}px`,
  };
};

// Color utilities
export const getColorWithOpacity = (color: string, opacity: number) => {
  // Convert hex to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export const getContrastColor = (backgroundColor: string) => {
  // Simple contrast calculation - returns white or black based on background brightness
  if (backgroundColor.startsWith('#')) {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? COLORS.TEXT.PRIMARY : COLORS.TEXT.INVERSE;
  }
  return COLORS.TEXT.PRIMARY;
};

// Typography utilities
export const createTypographyScale = (baseSize: number = 16) => {
  const scale = 1.25; // Major third scale
  return {
    xs: `${baseSize * Math.pow(scale, -2)}px`,
    sm: `${baseSize * Math.pow(scale, -1)}px`,
    base: `${baseSize}px`,
    lg: `${baseSize * scale}px`,
    xl: `${baseSize * Math.pow(scale, 2)}px`,
    '2xl': `${baseSize * Math.pow(scale, 3)}px`,
    '3xl': `${baseSize * Math.pow(scale, 4)}px`,
    '4xl': `${baseSize * Math.pow(scale, 5)}px`,
  };
};

export const getLineHeight = (fontSize: string, lineHeightRatio: number = 1.5) => {
  const numericSize = parseInt(fontSize);
  return `${numericSize * lineHeightRatio}px`;
};

// Shadow utilities
export const createCustomShadow = (
  offsetX: number = 0,
  offsetY: number = 0,
  blur: number = 0,
  spread: number = 0,
  color: string = 'rgba(0, 0, 0, 0.1)'
) => {
  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
};

export const getElevationShadow = (level: 1 | 2 | 3 | 4 | 5) => {
  const shadows = {
    1: SHADOWS.SM,
    2: SHADOWS.MD,
    3: SHADOWS.LG,
    4: SHADOWS.XL,
    5: SHADOWS['2XL'],
  };
  return shadows[level];
};

// Border radius utilities
export const createRoundedCorners = (size: keyof typeof SIZES.BUTTON) => {
  const buttonSize = SIZES.BUTTON[size];
  const numericSize = parseInt(buttonSize);
  return `${numericSize / 2}px`;
};

// Transition utilities
export const createTransition = (
  properties: string[] = ['all'],
  duration: keyof typeof TRANSITIONS = 'NORMAL',
  easing: string = 'ease-in-out' // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const transitionDuration = TRANSITIONS[duration];
  return properties.map(prop => `${prop} ${transitionDuration}`).join(', ');
};

// Responsive utilities
export const getBreakpointValue = (breakpoint: keyof typeof BREAKPOINTS) => {
  return BREAKPOINTS[breakpoint];
};

export const createMediaQuery = (breakpoint: keyof typeof BREAKPOINTS, minOrMax: 'min' | 'max' = 'min') => {
  const value = BREAKPOINTS[breakpoint];
  return `@media (${minOrMax}-width: ${value})`;
};

// Z-index utilities
export const createZIndexStack = (base: number = 1000) => {
  return {
    base: base,
    dropdown: base + 100,
    sticky: base + 200,
    banner: base + 300,
    overlay: base + 400,
    modal: base + 500,
    popover: base + 600,
    tooltip: base + 700,
    toast: base + 800,
  };
};

// Component size utilities
export const getComponentSize = (size: keyof typeof SIZES.BUTTON) => {
  return {
    height: SIZES.BUTTON[size],
    minHeight: SIZES.BUTTON[size],
    padding: `0 ${SPACING.MD}`,
    fontSize: size === 'SM' ? TYPOGRAPHY.FONT_SIZE.CAPTION : TYPOGRAPHY.FONT_SIZE.BODY2,
    borderRadius: BORDER_RADIUS.MD,
  };
};

// Layout utilities
export const createContainer = (maxWidth: string = '1200px') => {
  return {
    maxWidth,
    margin: '0 auto',
    padding: `0 ${SPACING.MD}`,
    boxSizing: 'border-box' as const,
  };
};

export const createGrid = (columns: number, gap: keyof typeof SPACING = 'MD') => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: SPACING[gap],
  };
};

// Export all utilities as a single object
export const designSystemUtils = {
  createSpacing,
  getResponsiveSpacing,
  getColorWithOpacity,
  getContrastColor,
  createTypographyScale,
  getLineHeight,
  createCustomShadow,
  getElevationShadow,
  createRoundedCorners,
  createTransition,
  getBreakpointValue,
  createMediaQuery,
  createZIndexStack,
  getComponentSize,
  createContainer,
  createGrid,
};
