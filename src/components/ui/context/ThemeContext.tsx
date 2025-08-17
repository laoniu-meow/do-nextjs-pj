"use client";

import React, { createContext, useContext, ReactNode } from "react";

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

// Default theme
const defaultTheme: Theme = {
  colors: {
    primary: "#3B82F6",
    secondary: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    background: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB",
      tertiary: "#F3F4F6",
    },
    text: {
      primary: "#111827",
      secondary: "#374151",
      muted: "#6B7280",
      inverse: "#FFFFFF",
    },
    border: {
      primary: "#D1D5DB",
      secondary: "#E5E7EB",
      muted: "#F3F4F6",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontFamily: {
      sans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
      serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
      mono: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px",
      "6xl": "60px",
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
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  borderRadius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    full: "9999px",
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
    primary: "#1F2937",
    secondary: "#4B5563",
    background: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB",
      tertiary: "#F3F4F6",
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
