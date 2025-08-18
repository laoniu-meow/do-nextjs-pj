"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { GenericSettingsPanel } from "@/components/settings/GenericSettingsPanel";
import { HEADER_SETTINGS_SCHEMA } from "@/types/settings";
import { useSettings } from "@/hooks/useSettings";

interface HeaderSettingsData
  extends Record<
    string,
    string | number | boolean | string[] | File | File[] | null
  > {
  siteTitle: string;
  tagline: string;
  showSearch: boolean;
  showUserMenu: boolean;
  stickyHeader: boolean;
  headerHeight: string;
  primaryColor: string;
}

export default function HeaderSettingsPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSettings, setCurrentSettings] =
    useState<HeaderSettingsData | null>(null);

  // Use the generic settings hook with header settings schema
  const settings = useSettings<HeaderSettingsData>(HEADER_SETTINGS_SCHEMA);

  // Load header settings from API
  const loadHeaderSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockSettings: HeaderSettingsData = {
        siteTitle: "Your Website",
        tagline: "Your company tagline here",
        showSearch: true,
        showUserMenu: true,
        stickyHeader: false,
        headerHeight: "64px",
        primaryColor: "#3b82f6",
      };

      setCurrentSettings(mockSettings);
      settings.updateOriginalData(mockSettings);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error loading header settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  // Load settings on component mount
  useEffect(() => {
    loadHeaderSettings();
  }, [loadHeaderSettings]);

  const handleBuild = () => {
    // Open settings panel with current settings
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    // Close without saving - revert to original
    settings.resetToOriginal();
    setIsSettingsOpen(false);
  };

  const handleApplySettings = (formData: HeaderSettingsData) => {
    // Save the new settings
    setCurrentSettings(formData);
    settings.updateOriginalData(formData);
    setHasUnsavedChanges(true);
    setIsSettingsOpen(false);

    // In a real app, you would save to your API here
    console.log("Header settings updated:", formData);
  };

  const handleSave = async () => {
    if (!currentSettings) return;

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

  // Handle settings data changes
  const handleSettingsDataChange = (newData: HeaderSettingsData) => {
    // Update the settings data
    settings.updateOriginalData(newData);
  };

  // Handle settings reset
  const handleSettingsReset = () => {
    if (currentSettings) {
      // Reset to the current settings (original values)
      settings.updateOriginalData(currentSettings);
    } else {
      // Reset to schema defaults
      settings.resetToDefaults();
    }
  };

  return (
    <PageLayout
      title="Header Settings"
      description="Customize your website header, navigation, and main layout settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Header Settings" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Header Configuration"
        showBuild={true}
        showSave={true}
        showRefresh={true}
        onBuild={handleBuild}
        onSave={handleSave}
        onRefresh={handleRefresh}
        saveDisabled={!hasUnsavedChanges || isLoading}
      >
        <div className="space-y-6">
          {/* Header settings configuration content */}
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Header & Navigation Configuration
            </h3>
            <p className="text-gray-500 text-sm">
              Click &ldquo;Build&rdquo; to customize your header settings. Use
              the settings panel to configure your website header and
              navigation.
            </p>
          </div>

          {/* Current Settings Display */}
          {currentSettings && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Current Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Site Title:
                    </span>
                    <p className="text-gray-800">{currentSettings.siteTitle}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Tagline:
                    </span>
                    <p className="text-gray-800">{currentSettings.tagline}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Header Height:
                    </span>
                    <p className="text-gray-800">
                      {currentSettings.headerHeight}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Primary Color:
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{
                          backgroundColor: currentSettings.primaryColor,
                        }}
                      />
                      <span className="text-gray-800">
                        {currentSettings.primaryColor}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Features:
                    </span>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            currentSettings.showSearch
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm text-gray-700">
                          Search Bar
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            currentSettings.showUserMenu
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm text-gray-700">User Menu</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            currentSettings.stickyHeader
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm text-gray-700">
                          Sticky Header
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
        </div>
      </MainContainerBox>

      <GenericSettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
        onCancel={handleCloseSettings}
        onReset={handleSettingsReset}
        schema={HEADER_SETTINGS_SCHEMA}
        data={settings.data}
        onDataChange={handleSettingsDataChange}
        title="Header & Navigation Settings"
        validationErrors={{}}
        showSectionHeaders={true}
        collapsibleSections={true}
      />
    </PageLayout>
  );
}
