"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ResponsiveHeader } from "./ResponsiveLayout";
import { useCompanyLogo } from "@/hooks/useCompanyLogo";
import { useStyling } from "@/hooks/useStyling";
import { iconLibrary } from "@/components/ui/config/iconLibrary";

interface HeaderProps {
  // Responsive settings for Desktop, Tablet, Mobile (optional with defaults)
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

  // Global settings (not device-specific)
  backgroundColor?: string;
  dropShadow?: "none" | "light" | "medium" | "strong";
  quickButtonBgColor?: string;
  quickButtonIconColor?: string;
  quickButtonHoverBgColor?: string;
  quickButtonHoverIconColor?: string;
  quickButtonShape?: "rounded" | "circle" | "square";
  quickButtonShadow?: "none" | "light" | "medium" | "strong";
  quickButtonGap?: string;
  menuButtonBgColor?: string;
  menuButtonIconColor?: string;
  menuButtonHoverBgColor?: string;
  menuButtonHoverIconColor?: string;
  menuButtonIconId?: string;
  menuButtonShape?: "rounded" | "circle" | "square";
  menuButtonShadow?: "none" | "light" | "medium" | "strong";
}

export function Header({
  // Responsive settings with defaults
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
  // Global settings with defaults
  backgroundColor = "#ffffff",
  dropShadow = "medium",
  quickButtonBgColor = "#f3f4f6",
  quickButtonIconColor = "#6b7280",
  quickButtonHoverBgColor = "#e5e7eb",
  quickButtonHoverIconColor = "#374151",
  quickButtonShape = "rounded",
  quickButtonShadow = "light",
  quickButtonGap = "8px",
  menuButtonBgColor = "#3b82f6",
  menuButtonIconColor = "#ffffff",
  menuButtonHoverBgColor = "#2563eb",
  menuButtonHoverIconColor = "#ffffff",
  menuButtonIconId = "menu",
  menuButtonShape = "rounded",
  menuButtonShadow = "light",
}: HeaderProps) {
  const [currentDevice, setCurrentDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const { getShadow, getShape } = useStyling();

  // Detect device size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCurrentDevice("desktop");
      } else if (width >= 768) {
        setCurrentDevice("tablet");
      } else {
        setCurrentDevice("mobile");
      }
    };

    handleResize(); // Set initial device
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get current device settings
  const getCurrentSettings = () => {
    switch (currentDevice) {
      case "tablet":
        return tablet;
      case "mobile":
        return mobile;
      default:
        return desktop;
    }
  };

  const currentSettings = getCurrentSettings();

  const {
    logoUrl,
    isLoading: logoLoading,
    error: logoError,
  } = useCompanyLogo();

  // Get the selected menu button icon from the icon library
  const selectedMenuIcon = useMemo(() => {
    return iconLibrary.find(icon => icon.id === menuButtonIconId) || iconLibrary.find(icon => icon.id === "menu");
  }, [menuButtonIconId]);

  // Memoize header styles to prevent unnecessary recalculations
  const headerStyles = useMemo(
    (): React.CSSProperties => ({
      height: currentSettings.height,
      backgroundColor,
      boxShadow: getShadow(dropShadow),
      padding: `${currentSettings.paddingVertical}px ${currentSettings.paddingHorizontal}px`,
      position: "relative",
      width: "100%",
      maxWidth: "100%",
      overflow: "hidden",
      boxSizing: "border-box",
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
    }),
    [
      currentSettings.height,
      currentSettings.paddingVertical,
      currentSettings.paddingHorizontal,
      backgroundColor,
      dropShadow,
      getShadow,
    ]
  );

  return (
    <ResponsiveHeader sticky={false} transparent={false}>
      <div
        style={headerStyles}
        className="header-container no-margin no-padding no-border no-outline"
      >
        {/* Logo - Left side */}
        <div className="header-logo-container">
          {logoLoading ? (
            <div
              className="bg-gray-200 animate-pulse rounded"
              style={{
                width: currentSettings.logoWidth,
                height: currentSettings.logoHeight,
              }}
            />
          ) : logoError ? (
            <div
              className="bg-red-100 text-red-600 text-xs flex items-center justify-center rounded border border-red-200"
              style={{
                width: currentSettings.logoWidth,
                height: currentSettings.logoHeight,
              }}
            ></div>
          ) : logoUrl ? (
            <Image
              src={logoUrl}
              alt="Company Logo"
              width={currentSettings.logoWidth}
              height={currentSettings.logoHeight}
              style={{
                width: currentSettings.logoWidth,
                height: currentSettings.logoHeight,
                margin: 0,
                padding: 0,
                border: "none",
                outline: "none",
                display: "block",
                verticalAlign: "middle",
                objectFit: "contain",
                objectPosition: "center",
              }}
              className="object-contain"
            />
          ) : (
            <div
              className="bg-gray-100 text-gray-500 text-xs flex items-center justify-center rounded border border-gray-200"
              style={{
                width: currentSettings.logoWidth,
                height: currentSettings.logoHeight,
              }}
            ></div>
          )}
        </div>

        {/* Quick Buttons - Center */}
        <div
          className="header-quick-buttons"
          style={{
            gap: quickButtonGap,
          }}
        >
          {[1, 2, 3, 4].map((index) => (
            <button
              key={index}
              className={`btn-base btn-hover-scale ${getShape(
                quickButtonShape
              )}`}
              style={{
                width: currentSettings.quickButtonSize,
                height: currentSettings.quickButtonSize,
                backgroundColor: quickButtonBgColor,
                boxShadow: getShadow(quickButtonShadow),
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = quickButtonHoverBgColor;
                e.currentTarget.style.color = quickButtonHoverIconColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = quickButtonBgColor;
                e.currentTarget.style.color = quickButtonIconColor;
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: quickButtonIconColor }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          ))}
        </div>

        {/* Menu Button - Right side */}
        <div className="header-menu-button">
          <button
            className={`btn-base btn-hover-scale ${getShape(menuButtonShape)}`}
            style={{
              width: currentSettings.menuButtonSize,
              height: currentSettings.menuButtonSize,
              backgroundColor: menuButtonBgColor,
              boxShadow: getShadow(menuButtonShadow),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = menuButtonHoverBgColor;
              e.currentTarget.style.color = menuButtonHoverIconColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = menuButtonBgColor;
              e.currentTarget.style.color = menuButtonIconColor;
            }}
          >
            {selectedMenuIcon ? (
              <selectedMenuIcon.icon
                style={{
                  width: 20,
                  height: 20,
                  color: menuButtonIconColor,
                }}
              />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: menuButtonIconColor }}
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
    </ResponsiveHeader>
  );
}
