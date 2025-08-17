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

export const SPACING = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  xxl: 8,
} as const;

// Consolidated responsive spacing values
export const RESPONSIVE_SPACING = {
  xs: { mobile: '4px', tablet: '6px', desktop: '8px' },
  sm: { mobile: '8px', tablet: '12px', desktop: '16px' },
  md: { mobile: '16px', tablet: '24px', desktop: '32px' },
  lg: { mobile: '24px', tablet: '32px', desktop: '48px' },
  xl: { mobile: '32px', tablet: '48px', desktop: '64px' },
  xxl: { mobile: '48px', tablet: '64px', desktop: '96px' }
} as const;

// Consolidated responsive typography values
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

// Consolidated responsive padding values
export const RESPONSIVE_PADDING = {
  xs: { mobile: '0.5rem', tablet: '0.75rem', desktop: '1rem' },
  sm: { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' },
  md: { mobile: '1.5rem', tablet: '2rem', desktop: '3rem' },
  lg: { mobile: '2rem', tablet: '3rem', desktop: '4rem' },
  xl: { mobile: '3rem', tablet: '4rem', desktop: '6rem' },
  xxl: { mobile: '4rem', tablet: '6rem', desktop: '8rem' }
} as const;

// Consolidated responsive margin values
export const RESPONSIVE_MARGIN = {
  xs: { mobile: '0.25rem', tablet: '0.5rem', desktop: '0.5rem' },
  sm: { mobile: '0.5rem', tablet: '1rem', desktop: '1rem' },
  md: { mobile: '1rem', tablet: '1.5rem', desktop: '1.5rem' },
  lg: { mobile: '1.5rem', tablet: '2rem', desktop: '2rem' },
  xl: { mobile: '2rem', tablet: '3rem', desktop: '3rem' },
  xxl: { mobile: '3rem', tablet: '4rem', desktop: '4rem' }
} as const;
