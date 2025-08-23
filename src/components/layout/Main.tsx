"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { useResponsive } from "@/hooks/useResponsive";
import { useStyling } from "@/hooks/useStyling";

interface MainProps {
  // Responsive settings for Desktop, Tablet, Mobile
  desktop?: {
    paddingHorizontal: number;
    paddingVertical: number;
    maxWidth: number;
    minHeight: number;
  };
  tablet?: {
    paddingHorizontal: number;
    paddingVertical: number;
    maxWidth: number;
    minHeight: number;
  };
  mobile?: {
    paddingHorizontal: number;
    paddingVertical: number;
    maxWidth: number;
    minHeight: number;
  };

  // Global settings (not device-specific)
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundGradient?: "none" | "subtle" | "moderate" | "strong";
  borderRadius?: "none" | "small" | "medium" | "large";
  shadow?: "none" | "light" | "medium" | "strong";
  children?: React.ReactNode;
  className?: string;
}

export function Main({
  // Responsive settings with defaults
  desktop = {
    paddingHorizontal: 32,
    paddingVertical: 24,
    maxWidth: 1200,
    minHeight: 600,
  },
  tablet = {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxWidth: 900,
    minHeight: 500,
  },
  mobile = {
    paddingHorizontal: 16,
    paddingVertical: 16,
    maxWidth: 600,
    minHeight: 400,
  },
  // Global settings with defaults
  backgroundColor = "#ffffff",
  backgroundImage = "",
  backgroundGradient = "subtle",
  borderRadius = "medium",
  shadow = "light",
  children,
  className = "",
}: MainProps) {
  const { deviceType } = useResponsive();
  const { getShadow } = useStyling();

  // Helper function for border radius
  const getBorderRadius = useCallback((radius: string): string => {
    const radiusMap = {
      none: "0",
      small: "4px",
      medium: "8px",
      large: "12px",
    };
    return radiusMap[radius as keyof typeof radiusMap] || radiusMap.medium;
  }, []);

  // Get current device settings
  const getCurrentSettings = useMemo(() => {
    switch (deviceType) {
      case "tablet":
        return tablet;
      case "mobile":
        return mobile;
      default:
        return desktop;
    }
  }, [deviceType, desktop, tablet, mobile]);

  // Debug current device and settings
  useEffect(() => {
    // debug removed for lint compliance
  }, [deviceType, getCurrentSettings]);

  const currentSettings = getCurrentSettings;

  // Get background styles based on gradient setting
  const getBackgroundStyles = useMemo((): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor,
      minHeight: currentSettings.minHeight,
      padding: `${currentSettings.paddingVertical}px ${currentSettings.paddingHorizontal}px`,
      borderRadius: getBorderRadius(borderRadius),
      boxShadow: getShadow(shadow),
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    };

    // Add background image if provided
    if (backgroundImage) {
      baseStyles.backgroundImage = `url(${backgroundImage})`;
      baseStyles.backgroundSize = "cover";
      baseStyles.backgroundPosition = "center";
      baseStyles.backgroundRepeat = "no-repeat";
    }

    // Add gradient overlay based on setting
    if (backgroundGradient !== "none") {
      const gradientOpacityMap = {
        subtle: "0.05",
        moderate: "0.1",
        strong: "0.2",
      } as const;
      const gradientOpacity =
        gradientOpacityMap[
          backgroundGradient as keyof typeof gradientOpacityMap
        ];

      baseStyles.position = "relative";

      // Create gradient overlay using pseudo-element
      const gradientOverlay = `
        linear-gradient(
          135deg,
          rgba(59, 130, 246, ${gradientOpacity}) 0%,
          rgba(99, 102, 241, ${gradientOpacity}) 50%,
          rgba(168, 85, 247, ${gradientOpacity}) 100%
        )
      `;

      baseStyles.backgroundImage = backgroundImage
        ? `${gradientOverlay}, url(${backgroundImage})`
        : gradientOverlay;
    }

    return baseStyles;
  }, [
    backgroundColor,
    backgroundImage,
    backgroundGradient,
    currentSettings,
    borderRadius,
    shadow,
    getShadow,
    getBorderRadius,
  ]);

  // Memoize main styles to prevent unnecessary recalculations
  const mainStyles = useMemo(
    (): React.CSSProperties => ({
      width: "100%",
      maxWidth: `${currentSettings.maxWidth}px`,
      margin: "0 auto",
      ...getBackgroundStyles,
    }),
    [currentSettings.maxWidth, getBackgroundStyles]
  );

  return (
    <ResponsiveLayout layout="stack" className={`main-component ${className}`}>
      <main
        className="main-content"
        style={mainStyles}
        role="main"
        aria-label="Main content area"
      >
        {/* Content wrapper with proper spacing */}
        <div className="main-content-wrapper">
          {children || (
            <div className="main-default-content">
              <h2 className="main-title">Welcome to Company WebApp</h2>
              <p className="main-description">
                This is the main content area. Add your content here to get
                started.
              </p>
              <div className="main-features">
                <div className="feature-item">
                  <h3>Responsive Design</h3>
                  <p>
                    Automatically adapts to desktop, tablet, and mobile devices
                  </p>
                </div>
                <div className="feature-item">
                  <h3>Customizable</h3>
                  <p>Easily configure colors, spacing, and layout options</p>
                </div>
                <div className="feature-item">
                  <h3>Professional UI</h3>
                  <p>
                    Built with modern design principles and accessibility in
                    mind
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ResponsiveLayout>
  );
}

export default Main;
