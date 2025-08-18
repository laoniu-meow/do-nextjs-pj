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
    >
      {renderLayout()}
    </Container>
  );
}

// Responsive Header Component
interface ResponsiveHeaderProps {
  children?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  transparent?: boolean;
}

export function ResponsiveHeader({
  children,
  transparent = false,
  className,
}: ResponsiveHeaderProps) {
  const headerStyles: React.CSSProperties = {
    position: "relative",
    backgroundColor: transparent ? "transparent" : "white",
    borderBottom: "none",
    padding: "0 !important", // Force zero padding with !important
    margin: "0 !important", // Force zero margin with !important
    transition: "all 0.2s ease-in-out",
    width: "100%", // Ensure full width within container
    height: "auto", // Auto height
    display: "block", // Block display
    boxSizing: "border-box", // Include padding in width calculation
    outline: "none", // Remove any outline
    border: "none", // Remove any border
    // Additional aggressive overrides
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
    marginLeft: "0 !important",
    marginRight: "0 !important",
    marginTop: "0 !important",
    marginBottom: "0 !important",
  };

  return (
    <header
      className={`responsive-header ${className || ""}`}
      style={{
        ...headerStyles,
        // Additional browser reset overrides
        all: "unset",
        display: "block",
        boxSizing: "border-box",
        // Force zero spacing
        padding: "0 !important",
        margin: "0 !important",
        border: "none !important",
        outline: "none !important",
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
