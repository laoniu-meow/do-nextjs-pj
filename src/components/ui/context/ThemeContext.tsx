"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { designSystem } from "@/styles/design-system";

// Theme interface
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: {
      sans: string;
      serif: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
      "5xl": string;
      "6xl": string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    largeDesktop: string;
  };
}

// Default theme using design system values
const defaultTheme: Theme = {
  colors: {
    primary: designSystem.colors.primary[500],
    secondary: designSystem.colors.neutral[500],
    success: designSystem.colors.success[500],
    warning: designSystem.colors.warning[500],
    error: designSystem.colors.error[500],
    info: designSystem.colors.primary[500],
    background: {
      primary: designSystem.colors.background.primary,
      secondary: designSystem.colors.background.secondary,
      tertiary: designSystem.colors.background.tertiary,
    },
    text: {
      primary: designSystem.colors.text.primary,
      secondary: designSystem.colors.text.secondary,
      muted: designSystem.colors.text.tertiary,
      inverse: designSystem.colors.text.inverse,
    },
    border: {
      primary: designSystem.colors.neutral[300],
      secondary: designSystem.colors.neutral[200],
      muted: designSystem.colors.neutral[100],
    },
  },
  spacing: {
    xs: designSystem.spacing.XS,
    sm: designSystem.spacing.SM,
    md: designSystem.spacing.MD,
    lg: designSystem.spacing.LG,
    xl: designSystem.spacing.XL,
    xxl: designSystem.spacing["2XL"],
  },
  typography: {
    fontFamily: {
      sans: designSystem.typography.fontFamily.BASE,
      serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
      mono: designSystem.typography.fontFamily.MONO,
    },
    fontSize: {
      xs: designSystem.typography.fontSize.CAPTION,
      sm: designSystem.typography.fontSize.BODY2,
      base: designSystem.typography.fontSize.BODY1,
      lg: designSystem.typography.fontSize.H5,
      xl: designSystem.typography.fontSize.H4,
      "2xl": designSystem.typography.fontSize.H3,
      "3xl": designSystem.typography.fontSize.H2,
      "4xl": designSystem.typography.fontSize.H1,
      "5xl": "3rem",
      "6xl": "3.75rem",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },
  shadows: {
    sm: designSystem.shadows.sm,
    md: designSystem.shadows.md,
    lg: designSystem.shadows.lg,
    xl: designSystem.shadows.xl,
    "2xl": designSystem.shadows["2xl"],
  },
  borderRadius: {
    sm: designSystem.borderRadius.sm,
    md: designSystem.borderRadius.md,
    lg: designSystem.borderRadius.lg,
    xl: designSystem.borderRadius.xl,
    full: designSystem.borderRadius.full,
  },
  breakpoints: {
    mobile: "640px",
    tablet: "768px",
    desktop: "1024px",
    largeDesktop: "1280px",
  },
};

// Admin-specific theme
const adminTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: designSystem.colors.neutral[800],
    secondary: designSystem.colors.neutral[600],
    background: {
      primary: designSystem.colors.surface.primary,
      secondary: designSystem.colors.surface.secondary,
      tertiary: designSystem.colors.surface.tertiary,
    },
  },
};

// Theme context
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: "default" | "admin" | "dark";
}

export function ThemeProvider({
  children,
  initialTheme = "default",
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(
    initialTheme === "admin" ? adminTheme : defaultTheme
  );
  const [isDark, setIsDark] = React.useState(false);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const toggleDark = () => {
    setIsDark(!isDark);
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    setTheme,
    isDark,
    toggleDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Hook to get specific theme values
export function useThemeColor() {
  const { theme } = useTheme();
  return theme.colors;
}

export function useThemeSpacing() {
  const { theme } = useTheme();
  return theme.spacing;
}

export function useThemeTypography() {
  const { theme } = useTheme();
  return theme.typography;
}

export function useThemeShadows() {
  const { theme } = useTheme();
  return theme.shadows;
}

export function useThemeBorderRadius() {
  const { theme } = useTheme();
  return theme.borderRadius;
}

export function useThemeBreakpoints() {
  const { theme } = useTheme();
  return theme.breakpoints;
}
