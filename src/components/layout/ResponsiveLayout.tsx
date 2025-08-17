"use client";

import React from "react";
import { useResponsive } from "@/hooks/useResponsive";
import {
  Container,
  GridContainer,
  FlexContainer,
} from "@/components/ui/Container";

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
  const GridLayout = ({
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
      <FlexContainer
        direction={isMobile ? "column" : "row"}
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
      </FlexContainer>
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
    <FlexContainer
      direction="column"
      gap={getResponsiveValue(gap, "16px")}
      className={className}
    >
      {header && <div className="layout-header">{header}</div>}
      <div className="layout-main">{children}</div>
      {footer && <div className="layout-footer">{footer}</div>}
    </FlexContainer>
  );

  const renderLayout = () => {
    switch (layout) {
      case "grid":
        return (
          <GridLayout columns={columns} gap={gap} className={className}>
            {children}
          </GridLayout>
        );

      case "sidebar":
        return (
          <SidebarLayout
            sidebar={sidebar!}
            mainContent={mainContent!}
            header={header}
            footer={footer}
            gap={gap}
            sidebarWidth={sidebarWidth}
            className={className}
          />
        );

      case "masonry":
        return (
          <MasonryLayout columns={columns} gap={gap} className={className}>
            {children}
          </MasonryLayout>
        );

      case "stack":
      default:
        return (
          <StackLayout
            header={header}
            footer={footer}
            gap={gap}
            className={className}
          >
            {children}
          </StackLayout>
        );
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
