"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ResponsiveHeader } from "./ResponsiveLayout";
import { useCompanyLogo } from "@/hooks/useCompanyLogo";

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
  menuButtonShape = "rounded",
  menuButtonShadow = "light",
}: HeaderProps) {
  const [currentDevice, setCurrentDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

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

  const getShapeClass = (shape: string) => {
    switch (shape) {
      case "circle":
        return "rounded-full";
      case "square":
        return "rounded-none";
      default:
        return "rounded-lg";
    }
  };

  const getShadowValue = (shadowOption: string) => {
    switch (shadowOption) {
      case "none":
        return "none";
      case "light":
        return "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)";
      case "medium":
        return "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)";
      case "strong":
        return "0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)";
      default:
        return "0 2px 8px rgba(0, 0, 0, 0.1)";
    }
  };

  const headerStyles: React.CSSProperties = {
    height: currentSettings.height,
    backgroundColor,
    boxShadow: getShadowValue(dropShadow),
    padding: `${currentSettings.paddingVertical} ${currentSettings.paddingHorizontal}`,
    margin: "0 !important", // Force zero margin with !important
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden", // Prevent overflow
    boxSizing: "border-box", // Include padding in width calculation
    outline: "none", // Remove any outline
    border: "none", // Remove any border
    // Aggressive CSS resets to override any conflicting styles
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    textDecoration: "none",
    listStyle: "none",
    // Ensure no default spacing
    letterSpacing: "normal",
    wordSpacing: "normal",
    textAlign: "left",
    verticalAlign: "baseline",
    // Remove any potential transforms
    transform: "none",
    // Force positioning context
    isolation: "isolate",
    // Additional aggressive overrides
    paddingLeft: `${currentSettings.paddingHorizontal} !important`,
    paddingRight: `${currentSettings.paddingHorizontal} !important`,
    paddingTop: `${currentSettings.paddingVertical} !important`,
    paddingBottom: `${currentSettings.paddingVertical} !important`,
    marginLeft: "0 !important",
    marginRight: "0 !important",
    marginTop: "0 !important",
    marginBottom: "0 !important",
  };

  return (
    <ResponsiveHeader sticky={false} transparent={false}>
      <div
        style={{
          ...headerStyles,
          // Override any potential Tailwind CSS spacing
          margin: "0 !important",
          padding: "0 !important",
          border: "none !important",
          outline: "none !important",
          // Force no spacing
          gap: "0",
          rowGap: "0",
          columnGap: "0",
          // Ensure proper positioning
          position: "relative",
          isolation: "isolate",
          // Additional aggressive overrides
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
          paddingTop: "0 !important",
          paddingBottom: "0 !important",
          marginLeft: "0 !important",
          marginRight: "0 !important",
          marginTop: "0 !important",
          marginBottom: "0 !important",
        }}
        className="w-full h-full p-0 m-0 overflow-hidden box-border relative"
      >
        {/* Logo - Left side (absolute left edge positioning) */}
        <div
          className="flex-shrink-0 logo-container"
          style={{
            // Force specific positioning first
            position: "absolute",
            left: "0", // Force to absolute left edge
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10, // Ensure it's above other elements
            // Ensure proper display for centering
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            // CSS resets for logo container
            margin: "0 !important",
            padding: "0 !important",
            border: "none !important",
            outline: "none !important",
            boxSizing: "border-box",
            // Remove any potential spacing
            float: "none",
            clear: "none",
            // Force positioning
            isolation: "isolate",
            // Additional aggressive overrides
            marginLeft: "0 !important",
            marginRight: "0 !important",
            marginTop: "0 !important",
            marginBottom: "0 !important",
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            paddingTop: "0 !important",
            paddingBottom: "0 !important",
          }}
        >
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
                // Remove any potential image spacing
                margin: "0 !important",
                padding: "0 !important",
                border: "none !important",
                outline: "none !important",
                display: "block",
                verticalAlign: "middle", // Changed from "top" to "middle" for better centering
                // Force no spacing
                marginLeft: "0 !important",
                marginRight: "0 !important",
                marginTop: "0 !important",
                marginBottom: "0 !important",
                paddingLeft: "0 !important",
                paddingRight: "0 !important",
                paddingTop: "0 !important",
                paddingBottom: "0 !important",
                // Ensure proper centering
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

        {/* Quick Buttons - Center (independent positioning) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            gap: quickButtonGap,
          }}
        >
          {[1, 2, 3, 4].map((index) => (
            <button
              key={index}
              className={`flex items-center justify-center transition-all duration-200 hover:scale-105 ${getShapeClass(
                quickButtonShape
              )}`}
              style={{
                width: currentSettings.quickButtonSize,
                height: currentSettings.quickButtonSize,
                backgroundColor: quickButtonBgColor,
                boxShadow: getShadowValue(quickButtonShadow),
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

        {/* Menu Button - Right side (independent positioning) */}
        <div
          className="flex-shrink-0"
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <button
            className={`flex items-center justify-center transition-all duration-200 hover:scale-105 ${getShapeClass(
              menuButtonShape
            )}`}
            style={{
              width: currentSettings.menuButtonSize,
              height: currentSettings.menuButtonSize,
              backgroundColor: menuButtonBgColor,
              boxShadow: getShadowValue(menuButtonShadow),
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
          </button>
        </div>
      </div>
    </ResponsiveHeader>
  );
}
