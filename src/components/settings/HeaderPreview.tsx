"use client";

import React from "react";
import { Header } from "@/components/layout/Header";

interface HeaderPreviewProps {
  headerSettings: {
    // Header appearance
    height: string;
    backgroundColor: string;
    dropShadow: string;

    // Logo settings
    logoWidth: string;
    logoHeight: string;

    // Quick button settings
    quickButtonSize: string;
    quickButtonBgColor: string;
    quickButtonIconColor: string;
    quickButtonHoverBgColor: string;
    quickButtonHoverIconColor: string;
    quickButtonShape: "rounded" | "circle" | "square";
    quickButtonShadow: string;
    quickButtonGap: string;

    // Menu button settings
    menuButtonWidth: string;
    menuButtonHeight: string;
    menuButtonBgColor: string;
    menuButtonIconColor: string;
    menuButtonHoverBgColor: string;
    menuButtonHoverIconColor: string;
    menuButtonShape: "rounded" | "circle" | "square";
    menuButtonShadow: string;
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
              height={headerSettings.height}
              backgroundColor={headerSettings.backgroundColor}
              dropShadow={headerSettings.dropShadow}
              logoWidth={headerSettings.logoWidth}
              logoHeight={headerSettings.logoHeight}
              quickButtonSize={headerSettings.quickButtonSize}
              quickButtonBgColor={headerSettings.quickButtonBgColor}
              quickButtonIconColor={headerSettings.quickButtonIconColor}
              quickButtonHoverBgColor={headerSettings.quickButtonHoverBgColor}
              quickButtonHoverIconColor={
                headerSettings.quickButtonHoverIconColor
              }
              quickButtonShape={headerSettings.quickButtonShape}
              quickButtonShadow={headerSettings.quickButtonShadow}
              quickButtonGap={headerSettings.quickButtonGap}
              menuButtonWidth={headerSettings.menuButtonWidth}
              menuButtonHeight={headerSettings.menuButtonHeight}
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
