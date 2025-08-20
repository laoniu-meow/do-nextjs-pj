import React from "react";
import { Alert, Typography } from "@mui/material";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { SettingsPanel } from "@/components/settings";
import { useHeaderMain } from "../hooks/useHeaderMain";
import { HeaderPreview } from "./HeaderPreview";
import { HeaderSettingsForm } from "./HeaderSettingsForm";

export const HeaderMainPage: React.FC = () => {
  const {
    headerSettings,
    isLoading,
    error,
    hasUnsavedChanges,
    hasStagingData,
    isSettingsOpen,
    handleSettingsChange,
    openSettings,
    closeSettings,
    saveHeaderSettings,
    uploadHeaderSettings,
    clearError,
  } = useHeaderMain();

  // Handle apply settings (apply to preview only)
  const handleApplySettings = async () => {
    try {
      // Apply settings to preview but don't save to database yet
      // This keeps hasUnsavedChanges as true so Save button remains enabled
      closeSettings();
    } catch (error) {
      console.error("Failed to apply settings:", error);
    }
  };

  // Handle save (save to staging database)
  const handleSave = async () => {
    try {
      await saveHeaderSettings(headerSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  // Handle build (open settings)
  const handleBuild = () => {
    openSettings();
  };

  // Handle upload (move staging to production)
  const handleUpload = async () => {
    try {
      await uploadHeaderSettings();
    } catch (error) {
      console.error("Failed to upload settings:", error);
    }
  };

  // Handle refresh
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
        onUpload={handleUpload}
        onRefresh={handleRefresh}
        saveDisabled={!hasUnsavedChanges || isLoading}
        uploadDisabled={!hasStagingData || isLoading}
      >
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert
              severity="error"
              className="mb-3"
              sx={{ borderRadius: "8px" }}
              onClose={clearError}
            >
              <Typography variant="body2" className="text-sm">
                {error}
              </Typography>
            </Alert>
          )}

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

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        onApply={handleApplySettings}
        title="Header & Navigation Settings"
      >
        <HeaderSettingsForm
          initialSettings={headerSettings}
          onSettingsChange={handleSettingsChange}
        />
      </SettingsPanel>
    </PageLayout>
  );
};
