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
}

export default function HeaderSettingsPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ResponsiveView>("desktop");

  // Default header settings
  const [headerSettings, setHeaderSettings] = useState<HeaderSettingsData>({
    // Header appearance
    height: "64px",
    backgroundColor: "#ffffff",
    dropShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",

    // Logo settings
    logoWidth: "40px",
    logoHeight: "40px",

    // Quick button settings
    quickButtonSize: "40px",
    quickButtonBgColor: "#f3f4f6",
    quickButtonIconColor: "#6b7280",
    quickButtonHoverBgColor: "#e5e7eb",
    quickButtonHoverIconColor: "#374151",
    quickButtonShape: "rounded",
    quickButtonShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    quickButtonGap: "0px",

    // Menu button settings
    menuButtonWidth: "40px",
    menuButtonHeight: "40px",
    menuButtonBgColor: "#3b82f6",
    menuButtonIconColor: "#ffffff",
    menuButtonHoverBgColor: "#2563eb",
    menuButtonHoverIconColor: "#ffffff",
    menuButtonShape: "rounded",
    menuButtonShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
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
