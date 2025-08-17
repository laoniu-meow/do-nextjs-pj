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
