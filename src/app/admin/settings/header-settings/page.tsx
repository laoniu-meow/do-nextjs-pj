"use client";

import React, { useState } from "react";
import {
  PageLayout,
  MainContainerBox,
  SettingsPanel,
  ResponsiveTabs,
  ResponsiveView,
} from "@/components/ui";

interface HeaderSettingsData {
  // TODO: Add header settings fields when database schema is defined
  // For now, using a placeholder to satisfy TypeScript requirements
  placeholder?: string;
}

export default function HeaderSettingsPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ResponsiveView>("desktop");

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
    setHasUnsavedChanges(true);
    setIsSettingsOpen(false);
    console.log("Settings applied:", formData);
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

  // Handle responsive view change
  const handleViewChange = (view: ResponsiveView) => {
    setCurrentView(view);
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
        {/* Responsive Tabs */}
        <ResponsiveTabs
          currentView={currentView}
          onViewChange={handleViewChange}
          showIcons={true}
        />

        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
        </div>
      </MainContainerBox>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={() => handleApplySettings({} as HeaderSettingsData)}
        title="Header & Navigation Settings"
      >
        <div className="text-center py-8">
          <p className="text-gray-500">
            Settings panel is ready for custom content
          </p>
        </div>
      </SettingsPanel>
    </PageLayout>
  );
}
