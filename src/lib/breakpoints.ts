// Responsive breakpoints for Mobile, Tablet, and Desktop
export const breakpoints = {
  // Mobile First Approach
  mobile: {
    min: 0,
    max: 767,
    container: '100%',
    padding: '16px',
    columns: 1,
    gap: '16px'
  },
  tablet: {
    min: 768,
    max: 1023,
    container: '90%',
    padding: '24px',
    columns: 2,
    gap: '24px'
  },
  desktop: {
    min: 1024,
    max: 1439,
    container: '1200px',
    padding: '32px',
    columns: 3,
    gap: '32px'
  },
  largeDesktop: {
    min: 1440,
    max: Infinity,
    container: '1400px',
    padding: '40px',
    columns: 4,
    gap: '40px'
  }
}

// CSS Media Query Breakpoints
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile.max}px)`,
  tablet: `@media (min-width: ${breakpoints.tablet.min}px) and (max-width: ${breakpoints.tablet.max}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop.min}px) and (max-width: ${breakpoints.desktop.max}px)`,
  largeDesktop: `@media (min-width: ${breakpoints.largeDesktop.min}px)`,
  
  // Responsive ranges
  tabletAndUp: `@media (min-width: ${breakpoints.tablet.min}px)`,
  desktopAndUp: `@media (min-width: ${breakpoints.desktop.min}px)`,
  
  // Max width queries
  tabletAndDown: `@media (max-width: ${breakpoints.tablet.max}px)`,
  desktopAndDown: `@media (max-width: ${breakpoints.desktop.max}px)`
}

// Device detection utilities
export const isMobile = (width: number): boolean => width <= breakpoints.mobile.max
export const isTablet = (width: number): boolean => width >= breakpoints.tablet.min && width <= breakpoints.tablet.max
export const isDesktop = (width: number): boolean => width >= breakpoints.desktop.min
export const isLargeDesktop = (width: number): boolean => width >= breakpoints.largeDesktop.min

// Get device type based on screen width
export const getDeviceType = (width: number): 'mobile' | 'tablet' | 'desktop' | 'largeDesktop' => {
  if (isMobile(width)) return 'mobile'
  if (isTablet(width)) return 'tablet'
  if (isLargeDesktop(width)) return 'largeDesktop'
  return 'desktop'
}

// Note: Spacing and typography values are now consolidated in src/components/ui/constants/theme.ts
// Import from there to avoid duplication
