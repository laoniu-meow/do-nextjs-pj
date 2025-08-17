"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";
import { useResponsive } from "@/hooks/useResponsive";
import {
  Container,
  GridContainer,
  FlexContainer,
} from "@/components/ui/core/Container";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  layout?: "stack" | "grid" | "sidebar" | "masonry";
  columns?: number | { mobile: number; tablet: number; desktop: number };
  gap?: string | { mobile: string; tablet: string; desktop: string };
  sidebarWidth?: string | { mobile: string; tablet: string; desktop: string };
  mainContent?: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function ResponsiveLayout({
  children,
  className,
  layout = "stack",
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: "16px", tablet: "24px", desktop: "32px" },
  sidebarWidth = { mobile: "100%", tablet: "250px", desktop: "300px" },
  mainContent,
  sidebar,
  header,
  footer,
}: ResponsiveLayoutProps) {
  const { deviceType, isMobile } = useResponsive();

  const getResponsiveValue = <T,>(
    value: T | { mobile: T; tablet: T; desktop: T },
    defaultValue: T
  ): T => {
    if (typeof value === "object" && value !== null && "mobile" in value) {
      const responsiveValue = value as { mobile: T; tablet: T; desktop: T };
      return (
        responsiveValue[
          deviceType === "largeDesktop" ? "desktop" : deviceType
        ] || defaultValue
      );
    }
    return value as T;
  };

  // Extract layout-specific components
  const renderGridLayout = ({
    children,
    columns,
    gap,
    className,
  }: {
    children: React.ReactNode;
    columns: number | { mobile: number; tablet: number; desktop: number };
    gap: string | { mobile: string; tablet: string; desktop: string };
    className?: string;
  }) => (
    <GridContainer
      columns={getResponsiveValue(columns, 1)}
      gap={getResponsiveValue(gap, "16px")}
      className={className}
    >
      {children}
    </GridContainer>
  );

  const renderFlexLayout = ({
    children,
    direction,
    gap,
    className,
  }: {
    children: React.ReactNode;
    direction: "row" | "column";
    gap: string | { mobile: string; tablet: string; desktop: string };
    className?: string;
  }) => {
    return (
      <FlexContainer
        direction={isMobile ? "column" : "row"}
        gap={getResponsiveValue(gap, "16px")}
        className={className}
      >
        {children}
      </FlexContainer>
    );
  };

  const renderColumnLayout = ({
    children,
    gap,
    className,
  }: {
    children: React.ReactNode;
    gap: string | { mobile: string; tablet: string; desktop: string };
    className?: string;
  }) => (
    <FlexContainer
      direction="column"
      gap={getResponsiveValue(gap, "16px")}
      className={className}
    >
      {children}
    </FlexContainer>
  );

  const SidebarLayout = ({
    sidebar,
    mainContent,
    header,
    footer,
    gap,
    sidebarWidth,
    className,
  }: {
    sidebar: React.ReactNode;
    mainContent: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    gap: string | { mobile: string; tablet: string; desktop: string };
    sidebarWidth: string | { mobile: string; tablet: string; desktop: string };
    className?: string;
  }) => {
    if (!sidebar || !mainContent) {
      console.warn(
        "Sidebar layout requires both sidebar and mainContent props"
      );
      return <div className={className}>{children}</div>;
    }

    return (
      <Container
        columns={isMobile ? 1 : 2}
        gap={getResponsiveValue(gap, "16px")}
        className={className}
      >
        {isMobile ? (
          // Mobile: Stack vertically
          <>
            {header && <div className="mobile-header">{header}</div>}
            <div className="mobile-main">{mainContent}</div>
            <div className="mobile-sidebar">{sidebar}</div>
            {footer && <div className="mobile-footer">{footer}</div>}
          </>
        ) : (
          // Tablet/Desktop: Side by side
          <>
            <div
              className="sidebar"
              style={{
                width: getResponsiveValue(sidebarWidth, "250px"),
                flexShrink: 0,
              }}
            >
              {sidebar}
            </div>
            <div className="main-content" style={{ flex: 1 }}>
              {mainContent}
            </div>
          </>
        )}
      </Container>
    );
  };

  const MasonryLayout = ({
    children,
    columns,
    gap,
    className,
  }: {
    children: React.ReactNode;
    columns: number | { mobile: number; tablet: number; desktop: number };
    gap: string | { mobile: string; tablet: string; desktop: string };
    className?: string;
  }) => (
    <div
      className={`masonry-layout ${className || ""}`}
      style={{
        columns: getResponsiveValue(columns, 1),
        columnGap: getResponsiveValue(gap, "16px"),
      }}
    >
      {children}
    </div>
  );

  const StackLayout = ({
    children,
    header,
    footer,
    gap,
    className,
  }: {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    gap: string | { mobile: string; tablet: string; desktop: string };
    className?: string;
  }) => (
    <Container
      columns={1}
      gap={getResponsiveValue(gap, "16px")}
      className={className}
    >
      {header && <div className="layout-header">{header}</div>}
      <div className="layout-main">{children}</div>
      {footer && <div className="layout-footer">{footer}</div>}
    </Container>
  );

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
  className,
  sticky = false,
  transparent = false,
}: ResponsiveHeaderProps) {
  const { isMobile } = useResponsive();

  const headerStyles: React.CSSProperties = {
    position: sticky ? "sticky" : "relative",
    top: sticky ? 0 : "auto",
    zIndex: sticky ? 1000 : "auto",
    backgroundColor: transparent ? "transparent" : "white",
    borderBottom: "none",
    padding: isMobile ? "16px" : "24px",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <header
      className={`responsive-header ${className || ""}`}
      style={headerStyles}
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
