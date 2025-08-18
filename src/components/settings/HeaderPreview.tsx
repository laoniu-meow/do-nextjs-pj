"use client";

import React from "react";
import { Header } from "@/components/layout/Header";

interface HeaderPreviewProps {
  headerSettings: {
    // Responsive settings for Desktop, Tablet, Mobile
    desktop: {
      height: number;
      paddingHorizontal: number;
      paddingVertical: number;
      logoWidth: number;
      logoHeight: number;
      quickButtonSize: number;
      menuButtonSize: number;
    };
    tablet: {
      height: number;
      paddingHorizontal: number;
      paddingVertical: number;
      logoWidth: number;
      logoHeight: number;
      quickButtonSize: number;
      menuButtonSize: number;
    };
    mobile: {
      height: number;
      paddingHorizontal: number;
      paddingVertical: number;
      logoWidth: number;
      logoHeight: number;
      quickButtonSize: number;
      menuButtonSize: number;
    };

    // Global settings (not device-specific)
    backgroundColor: string;
    dropShadow: "none" | "light" | "medium" | "strong";
    quickButtonBgColor: string;
    quickButtonIconColor: string;
    quickButtonHoverBgColor: string;
    quickButtonHoverIconColor: string;
    quickButtonShape: "rounded" | "circle" | "square";
    quickButtonShadow: "none" | "light" | "medium" | "strong";
    quickButtonGap: string;
    menuButtonBgColor: string;
    menuButtonIconColor: string;
    menuButtonHoverBgColor: string;
    menuButtonHoverIconColor: string;
    menuButtonShape: "rounded" | "circle" | "square";
    menuButtonShadow: "none" | "light" | "medium" | "strong";
  };
}

export function HeaderPreview({ headerSettings }: HeaderPreviewProps) {
  const getPreviewContainerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      border: "2px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      margin: "0",
      overflow: "hidden",
      position: "relative",
      width: "100%", // Use full width of parent container
      height: "800px", // Fixed height for desktop view
      // Override all parent padding
      padding: "0 !important",
      marginLeft: "0 !important",
      marginRight: "0 !important",
      marginTop: "0 !important",
      marginBottom: "0 !important",
      // Force no spacing
      boxSizing: "border-box",
      outline: "none",
    };

    return baseStyle;
  };

  const getDeviceLabel = (): string => {
    return "💻 Header Preview";
  };

  return (
    <div
      className="w-full"
      style={{
        // Override any parent padding/margin
        padding: "0 !important",
        margin: "0 !important",
        // Force no spacing
        boxSizing: "border-box",
      }}
    >
      {/* Device Label */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {getDeviceLabel()}
        </h3>
        <p className="text-sm text-gray-600">Live preview of your header</p>
      </div>

      {/* Preview Container - Full width to match main card */}
      <div
        className="w-full"
        style={{
          // Override any parent padding/margin
          padding: "0 !important",
          margin: "0 !important",
          // Force no spacing
          boxSizing: "border-box",
        }}
      >
        <div style={getPreviewContainerStyle()} className="shadow-lg">
          {/* Header Preview - Full width within container */}
          <div
            className="w-full overflow-hidden"
            style={{
              // Override any parent padding/margin
              padding: "0 !important",
              margin: "0 !important",
              // Force no spacing
              boxSizing: "border-box",
            }}
          >
            <Header
              desktop={headerSettings.desktop}
              tablet={headerSettings.tablet}
              mobile={headerSettings.mobile}
              backgroundColor={headerSettings.backgroundColor}
              dropShadow={headerSettings.dropShadow}
              quickButtonBgColor={headerSettings.quickButtonBgColor}
              quickButtonIconColor={headerSettings.quickButtonIconColor}
              quickButtonHoverBgColor={headerSettings.quickButtonHoverBgColor}
              quickButtonHoverIconColor={
                headerSettings.quickButtonHoverIconColor
              }
              quickButtonShape={headerSettings.quickButtonShape}
              quickButtonShadow={headerSettings.quickButtonShadow}
              quickButtonGap={headerSettings.quickButtonGap}
              menuButtonBgColor={headerSettings.menuButtonBgColor}
              menuButtonIconColor={headerSettings.menuButtonIconColor}
              menuButtonHoverBgColor={headerSettings.menuButtonHoverBgColor}
              menuButtonHoverIconColor={headerSettings.menuButtonHoverIconColor}
              menuButtonShape={headerSettings.menuButtonShape}
              menuButtonShadow={headerSettings.menuButtonShadow}
            />
          </div>

          {/* Content Area (placeholder) */}
          <div className="flex-1 bg-gray-50 p-8">
            <div className="text-center text-gray-500">
              <p className="text-lg">Content area preview</p>
              <p className="text-sm">Your main content will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
