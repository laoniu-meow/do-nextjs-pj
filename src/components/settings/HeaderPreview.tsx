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
    menuButtonIconId: string;
    menuButtonShape: "rounded" | "circle" | "square";
    menuButtonShadow: "none" | "light" | "medium" | "strong";
  };
}

export function HeaderPreview({ headerSettings }: HeaderPreviewProps) {
  const getPreviewContainerStyle = (): React.CSSProperties => ({
    border: "2px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    margin: 0,
    overflow: "hidden",
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    height: "800px",
    padding: 0,
    boxSizing: "border-box",
    outline: "none",
  });

  const getDeviceLabel = (): string => {
    return "💻 Header Preview";
  };

  return (
    <div className="w-full no-margin no-padding no-border header-preview-container">
      {/* Device Label */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {getDeviceLabel()}
        </h3>
        <p className="text-sm text-gray-600">Live preview of your header</p>
      </div>

      {/* Preview Container - Full width to match main card */}
      <div className="w-full no-margin no-padding no-border">
        <div style={getPreviewContainerStyle()} className="shadow-lg">
          {/* Header Preview - Full width within container */}
          <div className="w-full no-margin no-padding no-border">
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
              menuButtonIconId={headerSettings.menuButtonIconId}
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
