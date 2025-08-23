"use client";

import React, { useEffect, useRef, useState } from "react";
import ComputerIcon from "@mui/icons-material/Computer";
import { designSystem } from "@/styles/design-system";
import { Header } from "@/components/layout/Header";
import { HeaderSettingsData } from "../types/headerMain";

interface HeaderPreviewProps {
  headerSettings: HeaderSettingsData;
}

export function HeaderPreview({ headerSettings }: HeaderPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(800);

  // Calculate a viewport-fitted height for the preview container
  useEffect(() => {
    const calculateHeight = () => {
      const top = containerRef.current?.getBoundingClientRect().top ?? 0;
      const paddingBottom = 24; // breathing room within the viewport
      const availableHeight = Math.max(
        320,
        Math.floor(window.innerHeight - top - paddingBottom)
      );
      setContainerHeight(availableHeight);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  const getPreviewContainerStyle = (): React.CSSProperties => ({
    border: "2px solid #e5e7eb",
    backgroundColor: headerSettings.pageBackgroundColor || "#f9fafb",
    margin: 0,
    overflow: "hidden",
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    height: `${containerHeight}px`,
    padding: 0,
    boxSizing: "border-box",
    outline: "none",
  });

  const DeviceLabel = () => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <ComputerIcon sx={{ color: designSystem.colors.primary[600] }} />
      <span>Header Preview</span>
    </span>
  );

  return (
    <div className="w-full no-margin no-padding no-border header-preview-container">
      {/* Device Label */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          <DeviceLabel />
        </h3>
        <p className="text-sm text-gray-600">Live preview of your header</p>
      </div>

      {/* Preview Container - Full width to match main card */}
      <div className="w-full no-margin no-padding no-border">
        <div
          ref={containerRef}
          style={getPreviewContainerStyle()}
          className="shadow-lg"
        >
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

          {/* Content Area */}
          <div
            className="flex-1 p-8"
            style={{
              backgroundColor: headerSettings.pageBackgroundColor || "#f9fafb",
            }}
          >
            {/* Intentionally left empty for a clean preview area */}
          </div>
        </div>
      </div>
    </div>
  );
}
