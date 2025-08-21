"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { ResponsiveHeader } from "./ResponsiveLayout";
import { useCompanyLogo } from "@/hooks/useCompanyLogo";
import { useStyling } from "@/hooks/useStyling";
import { useResponsive } from "@/hooks/useResponsive";
import { iconLibrary } from "@/components/ui/config/iconLibrary";

interface HeaderProps {
  // Responsive settings for Desktop, Tablet, Mobile (optional with defaults)
  desktop?: {
    height: number;
    paddingHorizontal: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  tablet?: {
    height: number;
    paddingHorizontal: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  mobile?: {
    height: number;
    paddingHorizontal: number;
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
    logoWidth: 40,
    logoHeight: 40,
    quickButtonSize: 40,
    menuButtonSize: 40,
  },
  tablet = {
    height: 64,
    paddingHorizontal: 16,
    logoWidth: 40,
    logoHeight: 40,
    quickButtonSize: 40,
    menuButtonSize: 40,
  },
  mobile = {
    height: 64,
    paddingHorizontal: 16,
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
  menuButtonBgColor = "var(--color-neutral-200)",
  menuButtonIconColor = "var(--color-neutral-700)",
  menuButtonHoverBgColor = "var(--color-neutral-300)",
  menuButtonHoverIconColor = "var(--color-neutral-800)",
  menuButtonIconId = "menu",
  menuButtonShape = "rounded",
  menuButtonShadow = "light",
}: HeaderProps) {
  // Validate props to prevent errors - wrapped in useMemo to prevent recreation on every render
  const validatedDesktop = useMemo(
    () => ({
      height: Math.max(1, desktop?.height || 64),
      paddingHorizontal: Math.max(0, desktop?.paddingHorizontal || 16),
      logoWidth: Math.max(1, desktop?.logoWidth || 40),
      logoHeight: Math.max(1, desktop?.logoHeight || 40),
      quickButtonSize: Math.max(1, desktop?.quickButtonSize || 40),
      menuButtonSize: Math.max(1, desktop?.menuButtonSize || 40),
    }),
    [desktop]
  );

  const validatedTablet = useMemo(
    () => ({
      height: Math.max(1, tablet?.height || 64),
      paddingHorizontal: Math.max(0, tablet?.paddingHorizontal || 16),
      logoWidth: Math.max(1, tablet?.logoWidth || 40),
      logoHeight: Math.max(1, tablet?.logoHeight || 40),
      quickButtonSize: Math.max(1, tablet?.quickButtonSize || 40),
      menuButtonSize: Math.max(1, tablet?.menuButtonSize || 40),
    }),
    [tablet]
  );

  const validatedMobile = useMemo(
    () => ({
      height: Math.max(1, mobile?.height || 64),
      paddingHorizontal: Math.max(0, mobile?.paddingHorizontal || 16),
      logoWidth: Math.max(1, mobile?.logoWidth || 40),
      logoHeight: Math.max(1, mobile?.logoHeight || 40),
      quickButtonSize: Math.max(1, mobile?.quickButtonSize || 40),
      menuButtonSize: Math.max(1, mobile?.menuButtonSize || 40),
    }),
    [mobile]
  );

  const { deviceType } = useResponsive();
  const { getShadow, getShape } = useStyling();

  // Add error handling for hooks
  // Avoid disallowed console usage

  // Get current device settings
  const getCurrentSettings = useMemo(() => {
    switch (deviceType) {
      case "tablet":
        return validatedTablet;
      case "mobile":
        return validatedMobile;
      default:
        return validatedDesktop;
    }
  }, [deviceType, validatedDesktop, validatedTablet, validatedMobile]);

  const currentSettings = getCurrentSettings;

  // Debug current device and settings
  useEffect(() => {
    // debug removed for lint compliance
  }, [deviceType, getCurrentSettings, currentSettings]);

  const {
    logoUrl,
    isLoading: logoLoading,
    error: logoError,
  } = useCompanyLogo();

  // Get the selected menu button icon from the icon library
  const selectedMenuIcon = useMemo(() => {
    const icon =
      iconLibrary.find((icon) => icon.id === menuButtonIconId) ||
      iconLibrary.find((icon) => icon.id === "menu");
    return icon;
  }, [menuButtonIconId]);

  // Header styles are now handled by ResponsiveHeader

  try {
    return (
      <ResponsiveHeader
        sticky={false}
        transparent={false}
        desktop={{
          height: currentSettings.height,
          paddingHorizontal: 0,
          paddingVertical: 0,
          logoWidth: 40,
          logoHeight: 40,
          quickButtonSize: 40,
          menuButtonSize: 40,
        }}
        tablet={{
          height: currentSettings.height,
          paddingHorizontal: 0,
          paddingVertical: 0,
          logoWidth: 40,
          logoHeight: 40,
          quickButtonSize: 40,
          menuButtonSize: 40,
        }}
        mobile={{
          height: currentSettings.height,
          paddingHorizontal: 0,
          paddingVertical: 0,
          logoWidth: 40,
          logoHeight: 40,
          quickButtonSize: 40,
          menuButtonSize: 40,
        }}
      >
        <div
          style={{
            height: currentSettings.height,
            backgroundColor,
            // Apply horizontal padding inside the header container
            padding: `0 ${currentSettings.paddingHorizontal}px`,
          }}
          className={`header-container header-shadow-${dropShadow}`}
          data-drop-shadow={dropShadow}
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
              gap:
                typeof quickButtonGap === "number"
                  ? quickButtonGap
                  : /^(\d+)$/.test(String(quickButtonGap))
                  ? `${quickButtonGap}px`
                  : quickButtonGap,
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
                  color: quickButtonIconColor,
                  boxShadow: getShadow(quickButtonShadow),
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    quickButtonHoverBgColor;
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
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            ))}
          </div>

          {/* Menu Button - Right side */}
          <div className="header-menu-button">
            <button
              className={`btn-base btn-hover-scale ${getShape(
                menuButtonShape
              )}`}
              style={{
                width: currentSettings.menuButtonSize,
                height: currentSettings.menuButtonSize,
                backgroundColor: menuButtonBgColor,
                color: menuButtonIconColor,
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
  } catch {
    return (
      <div
        style={{
          height: currentSettings.height,
          backgroundColor: "#f0f0f0", // Fallback background
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#333",
          fontSize: "1.25rem",
          fontWeight: "bold",
        }}
      >
        Error loading header.
      </div>
    );
  }
}
