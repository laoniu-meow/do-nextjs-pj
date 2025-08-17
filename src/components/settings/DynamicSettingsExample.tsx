"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Alert, Paper } from "@mui/material";
import { Settings, Business, ViewHeadline, People } from "@mui/icons-material";
import { DynamicSettingsPanel } from "./DynamicSettingsPanel";
import { useSettingsContent } from "@/hooks/useSettingsContent";

export const DynamicSettingsExample: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastAppliedSettings, setLastAppliedSettings] = useState<string>("");
  const settingsContent = useSettingsContent();

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleApplySettings = () => {
    if (settingsContent) {
      setLastAppliedSettings(
        `${settingsContent.title} - ${new Date().toLocaleTimeString()}`
      );
    }
    setIsSettingsOpen(false);
  };

  const getPageIcon = () => {
    if (!settingsContent) return <Settings />;

    switch (settingsContent.pageType) {
      case "company-profile":
        return <Business />;
      case "header-main":
        return <ViewHeadline />;
      case "users":
        return <People />;
      default:
        return <Settings />;
    }
  };

  const getPageDescription = () => {
    if (!settingsContent) return "No settings available for this page";
    return settingsContent.description;
  };

  return (
    <Box className="p-6 space-y-6">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
        Dynamic Settings Panel Demo
      </Typography>

      {/* Current Page Info */}
      <Paper className="p-4 bg-blue-50 border border-blue-200">
        <Box className="flex items-center space-x-3 mb-3">
          {getPageIcon()}
          <Typography variant="h6" className="font-semibold text-blue-800">
            Current Page Settings
          </Typography>
        </Box>

        {settingsContent ? (
          <Box className="space-y-2">
            <Typography variant="body1" className="font-medium text-blue-700">
              {settingsContent.title}
            </Typography>
            <Typography variant="body2" className="text-blue-600">
              {getPageDescription()}
            </Typography>
            <Typography variant="caption" className="text-blue-500">
              Page Type: {settingsContent.pageType}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" className="text-blue-600">
            No settings content detected for this page
          </Typography>
        )}
      </Paper>

      {/* Instructions */}
      <Paper className="p-4 bg-gray-50 border border-gray-200">
        <Typography variant="h6" className="font-semibold text-gray-800 mb-3">
          How It Works
        </Typography>
        <Box className="space-y-2 text-sm text-gray-600">
          <Typography variant="body2">
            • The{" "}
            <code className="bg-gray-200 px-1 rounded">useSettingsContent</code>{" "}
            hook automatically detects the current page
          </Typography>
          <Typography variant="body2">
            • Different settings content is shown based on the page route
          </Typography>
          <Typography variant="body2">
            • Company Profile page shows company form settings
          </Typography>
          <Typography variant="body2">
            • Header & Main page shows layout settings
          </Typography>
          <Typography variant="body2">
            • Users page shows user management settings
          </Typography>
          <Typography variant="body2">
            • Other pages show placeholder content
          </Typography>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box className="flex justify-center">
        <Button
          variant="contained"
          size="large"
          startIcon={<Settings />}
          onClick={handleOpenSettings}
          sx={{
            backgroundColor: "#3b82f6",
            "&:hover": { backgroundColor: "#2563eb" },
            px: 4,
            py: 1.5,
          }}
        >
          Open Settings Panel
        </Button>
      </Box>

      {/* Last Applied Settings */}
      {lastAppliedSettings && (
        <Alert severity="success" className="mt-4">
          <Typography variant="body2" className="font-medium">
            Settings Applied Successfully!
          </Typography>
          <Typography variant="caption" className="block mt-1">
            {lastAppliedSettings}
          </Typography>
        </Alert>
      )}

      {/* Navigation Tips */}
      <Paper className="p-4 bg-green-50 border border-green-200">
        <Typography variant="h6" className="font-semibold text-green-800 mb-3">
          Try Different Pages
        </Typography>
        <Typography variant="body2" className="text-green-700 mb-3">
          Navigate to different admin pages to see how the settings panel
          content changes automatically:
        </Typography>
        <Box className="space-y-1 text-sm text-green-600">
          <Typography variant="body2">
            • <strong>/admin/settings/company-profile</strong> → Company Profile
            Settings
          </Typography>
          <Typography variant="body2">
            • <strong>/admin/settings/header-main</strong> → Header & Main
            Settings
          </Typography>
          <Typography variant="body2">
            • <strong>/admin/users</strong> → User Management Settings
          </Typography>
          <Typography variant="body2">
            • <strong>/admin/dashboard</strong> → Dashboard Settings
          </Typography>
        </Box>
      </Paper>

      {/* Dynamic Settings Panel */}
      <DynamicSettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
      />
    </Box>
  );
};
