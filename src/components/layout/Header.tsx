"use client";

import React from "react";
import { ResponsiveHeader } from "./ResponsiveLayout";
import { useCompanyLogo } from "@/hooks/useCompanyLogo";

interface HeaderProps {
  // Header appearance
  height?: string;
  backgroundColor?: string;
  dropShadow?: string;

  // Logo settings
  logoWidth?: string;
  logoHeight?: string;

  // Quick button settings
  quickButtonSize?: string;
  quickButtonBgColor?: string;
  quickButtonIconColor?: string;
  quickButtonHoverBgColor?: string;
  quickButtonHoverIconColor?: string;
  quickButtonShape?: "rounded" | "circle" | "square";
  quickButtonShadow?: string;
  quickButtonGap?: string;

  // Menu button settings
  menuButtonWidth?: string;
  menuButtonHeight?: string;
  menuButtonBgColor?: string;
  menuButtonIconColor?: string;
  menuButtonHoverBgColor?: string;
  menuButtonHoverIconColor?: string;
  menuButtonShape?: "rounded" | "circle" | "square";
  menuButtonShadow?: string;
}

export function Header({
  // Default values
  height = "64px",
  backgroundColor = "#ffffff",
  dropShadow = "0 2px 8px rgba(0, 0, 0, 0.1)",
  logoWidth = "40px",
  logoHeight = "40px",
  quickButtonSize = "40px",
  quickButtonBgColor = "#f3f4f6",
  quickButtonIconColor = "#6b7280",
  quickButtonHoverBgColor = "#e5e7eb",
  quickButtonHoverIconColor = "#374151",
  quickButtonShape = "rounded",
  quickButtonShadow = "0 1px 3px rgba(0, 0, 0, 0.1)",
  quickButtonGap = "8px",
  menuButtonWidth = "40px",
  menuButtonHeight = "40px",
  menuButtonBgColor = "#3b82f6",
  menuButtonIconColor = "#ffffff",
  menuButtonHoverBgColor = "#2563eb",
  menuButtonHoverIconColor = "#ffffff",
  menuButtonShape = "rounded",
  menuButtonShadow = "0 1px 3px rgba(0, 0, 0, 0.1)",
}: HeaderProps) {
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

  const headerStyles: React.CSSProperties = {
    height,
    backgroundColor,
    boxShadow: dropShadow,
    padding: "0 !important", // Force zero padding with !important
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
                width: logoWidth,
                height: logoHeight,
              }}
            />
          ) : logoError ? (
            <div
              className="bg-red-100 text-red-600 text-xs flex items-center justify-center rounded border border-red-200"
              style={{
                width: logoWidth,
                height: logoHeight,
              }}
            ></div>
          ) : logoUrl ? (
            <img
              src={logoUrl}
              alt="Company Logo"
              style={{
                width: logoWidth,
                height: logoHeight,
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
                width: logoWidth,
                height: logoHeight,
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
                width: quickButtonSize,
                height: quickButtonSize,
                backgroundColor: quickButtonBgColor,
                boxShadow: quickButtonShadow,
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
              <span
                className="text-lg font-semibold"
                style={{ color: quickButtonIconColor }}
              >
                {index}
              </span>
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
              width: menuButtonWidth,
              height: menuButtonHeight,
              backgroundColor: menuButtonBgColor,
              boxShadow: menuButtonShadow,
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
