"use client";

import React from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { Container, GridContainer } from "@/components/ui/core/Container";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  layout?: "stack" | "grid" | "sidebar" | "masonry";
  columns?: number | { mobile: number; tablet: number; desktop: number };
  gap?: string | { mobile: string; tablet: string; desktop: string };
  sidebar?: React.ReactNode;
}

export function ResponsiveLayout({
  children,
  className,
  layout = "stack",
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: "16px", tablet: "24px", desktop: "32px" },
  sidebar,
}: ResponsiveLayoutProps) {
  const { isMobile } = useResponsive();

  const getResponsiveValue = <T,>(
    value: T | { mobile: T; tablet: T; desktop: T },
    defaultValue: T
  ): T => {
    if (typeof value === "object" && value !== null && "mobile" in value) {
      const responsiveValue = value as { mobile: T; tablet: T; desktop: T };
      return responsiveValue[isMobile ? "mobile" : "desktop"] || defaultValue;
    }
    return value as T;
  };

  const renderLayout = () => {
    switch (layout) {
      case "grid":
        return (
          <GridContainer
            columns={getResponsiveValue(columns, 1)}
            gap={getResponsiveValue(gap, "16px")}
            className={className}
          >
            {children}
          </GridContainer>
        );

      case "sidebar":
        return (
          <div className={cn("layout-sidebar", className)}>
            <div className="layout-sidebar-content">
              <div className="layout-sidebar-main">{children}</div>
              {sidebar && (
                <div className="layout-sidebar-sidebar">{sidebar}</div>
              )}
            </div>
          </div>
        );

      case "masonry":
        return (
          <div className={cn("layout-masonry", className)}>
            <div className="layout-masonry-content">{children}</div>
          </div>
        );

      default:
        return <Container className={className}>{children}</Container>;
    }
  };

  return (
    <Container
      maxWidth={isMobile ? "full" : "lg"}
      padding={isMobile ? "md" : "lg"}
      className="responsive-layout-container"
    >
      {renderLayout()}
    </Container>
  );
}

// Responsive Header Component
interface ResponsiveHeaderProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
  transparent?: boolean;
  desktop?: {
    height: number;
    paddingHorizontal: number;
    paddingVertical: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  tablet?: {
    height: number;
    paddingHorizontal: number;
    paddingVertical: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  mobile?: {
    height: number;
    paddingHorizontal: number;
    paddingVertical: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
}

export function ResponsiveHeader({
  children,
  className,
  sticky = false,
  transparent = false,
  desktop = {
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    logoWidth: 40,
    logoHeight: 40,
    quickButtonSize: 40,
    menuButtonSize: 40,
  },
  tablet = {
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    logoWidth: 40,
    logoHeight: 40,
    quickButtonSize: 40,
    menuButtonSize: 40,
  },
  mobile = {
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    logoWidth: 40,
    logoHeight: 40,
    quickButtonSize: 40,
    menuButtonSize: 40,
  },
}: ResponsiveHeaderProps) {
  const { deviceType } = useResponsive();

  const getCurrentSettings = () => {
    switch (deviceType) {
      case "tablet":
        return tablet;
      case "mobile":
        return mobile;
      default:
        return desktop;
    }
  };

  const currentSettings = getCurrentSettings();

  const headerStyles: React.CSSProperties = {
    height: currentSettings.height,
    padding: `${currentSettings.paddingVertical}px ${currentSettings.paddingHorizontal}px`,
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    overflow: "visible",
    boxSizing: "border-box",
    margin: 0,
    outline: "none",
    border: "none",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    textDecoration: "none",
    listStyle: "none",
    letterSpacing: "normal",
    wordSpacing: "normal",
    textAlign: "left",
    verticalAlign: "baseline",
    transform: "none",
    isolation: "isolate",
  };

  return (
    <header
      className={`responsive-header ${className || ""}`}
      style={{
        ...headerStyles,
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : "auto",
        zIndex: sticky ? 100 : "auto",
        backgroundColor: transparent ? "transparent" : "inherit",
        backdropFilter: transparent ? "blur(8px)" : "none",
        WebkitBackdropFilter: transparent ? "blur(8px)" : "none",
      }}
    >
      {children}
    </header>
  );
}

// Responsive Footer Component
interface ResponsiveFooterProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "minimal" | "full";
}

export function ResponsiveFooter({
  children,
  className,
  variant = "default",
}: ResponsiveFooterProps) {
  const { isMobile } = useResponsive();

  const getFooterStyles = () => {
    const baseStyles = {
      padding: isMobile ? "24px 16px" : "48px 32px",
      borderTop: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
    };

    switch (variant) {
      case "minimal":
        return {
          ...baseStyles,
          padding: isMobile ? "16px" : "24px",
          textAlign: "center" as const,
        };
      case "full":
        return {
          ...baseStyles,
          padding: isMobile ? "32px 16px" : "64px 32px",
        };
      default:
        return baseStyles;
    }
  };

  return (
    <footer
      className={`responsive-footer footer-${variant} ${className || ""}`}
      style={getFooterStyles()}
    >
      {children}
    </footer>
  );
}

// Responsive Navigation Component
interface ResponsiveNavigationProps {
  children: React.ReactNode;
  className?: string;
  variant?: "horizontal" | "vertical" | "mobile";
}

export function ResponsiveNavigation({
  children,
  className,
  variant = "horizontal",
}: ResponsiveNavigationProps) {
  const { isMobile } = useResponsive();

  const getNavStyles = (): React.CSSProperties => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "12px" : "16px",
    };

    switch (variant) {
      case "vertical":
        return {
          ...baseStyles,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
        };
      case "mobile":
        return {
          ...baseStyles,
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0",
          width: "100%",
        };
      default:
        return {
          ...baseStyles,
          flexDirection: "row",
          flexWrap: isMobile ? "wrap" : "nowrap",
        };
    }
  };

  return (
    <nav
      className={`responsive-navigation nav-${variant} ${className || ""}`}
      style={getNavStyles()}
    >
      {children}
    </nav>
  );
}
