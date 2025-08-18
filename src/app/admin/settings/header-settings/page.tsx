"use client";

import React, { useState } from "react";
import {
  PageLayout,
  MainContainerBox,
  SettingsPanel,
  ResponsiveTabs,
  ResponsiveView,
} from "@/components/ui";
import { HeaderPreview } from "@/components/settings/HeaderPreview";
import { HeaderSettingsForm } from "@/components/settings/HeaderSettingsForm";

interface HeaderSettingsData {
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
  menuButtonIconId: string;
}

export default function HeaderSettingsPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ResponsiveView>("desktop");

  // Default header settings
  const [headerSettings, setHeaderSettings] = useState<HeaderSettingsData>({
    // Responsive settings for Desktop, Tablet, Mobile
    desktop: {
      height: 64,
      paddingHorizontal: 0,
      paddingVertical: 0,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },
    tablet: {
      height: 64,
      paddingHorizontal: 0,
      paddingVertical: 0,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },
    mobile: {
      height: 64,
      paddingHorizontal: 0,
      paddingVertical: 0,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },

    // Global settings (not device-specific)
    backgroundColor: "#ffffff",
    dropShadow: "medium" as const,
    quickButtonBgColor: "#f3f4f6",
    quickButtonIconColor: "#6b7280",
    quickButtonHoverBgColor: "#e5e7eb",
    quickButtonHoverIconColor: "#374151",
    quickButtonShape: "rounded",
    quickButtonShadow: "light" as const,
    quickButtonGap: "8px",
    menuButtonBgColor: "#3b82f6",
    menuButtonIconColor: "#ffffff",
    menuButtonHoverBgColor: "#2563eb",
    menuButtonHoverIconColor: "#ffffff",
    menuButtonIconId: "menu",
    menuButtonShape: "rounded",
    menuButtonShadow: "light" as const,
  });

  const handleBuild = () => {
    // Open settings panel with current settings
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    // Close without saving
    setIsSettingsOpen(false);
  };

  const handleApplySettings = (formData: HeaderSettingsData) => {
    // Settings applied
    setHeaderSettings(formData);
    setHasUnsavedChanges(true);
    setIsSettingsOpen(false);
    console.log("Settings applied:", formData);
  };

  const handleSettingsChange = (newSettings: HeaderSettingsData) => {
    setHeaderSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would save to your API here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setHasUnsavedChanges(false);
      alert("Header settings saved successfully!");
    } catch (error) {
      console.error("Error saving header settings:", error);
      alert("Error saving header settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <PageLayout
      title="Header & Main"
      description="Customize your website header, navigation, and main page background settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Header & Main" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Header & Main Configuration"
        showBuild={true}
        showSave={true}
        showUpload={true}
        showRefresh={true}
        onBuild={handleBuild}
        onSave={handleSave}
        onUpload={() => console.log("Upload clicked")}
        onRefresh={handleRefresh}
        saveDisabled={!hasUnsavedChanges || isLoading}
      >
        <div className="space-y-6">
          {/* Device Tabs */}
          <ResponsiveTabs
            currentView={currentView}
            onViewChange={setCurrentView}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          {/* Header Preview */}
          <HeaderPreview headerSettings={headerSettings} />
        </div>
      </MainContainerBox>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={() => handleApplySettings(headerSettings)}
        title="Header & Navigation Settings"
      >
        <HeaderSettingsForm
          initialSettings={headerSettings}
          onSettingsChange={handleSettingsChange}
        />
      </SettingsPanel>
    </PageLayout>
  );
}
