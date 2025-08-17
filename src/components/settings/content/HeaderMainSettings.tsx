"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Button,
} from "@mui/material";
import { Save } from "@mui/icons-material";

interface HeaderMainSettingsProps {
  onApply: () => void;
  onCancel: () => void;
}

export const HeaderMainSettings: React.FC<HeaderMainSettingsProps> = ({
  onApply,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteTitle: "Your Website",
    tagline: "Your company tagline here",
    showSearch: true,
    showUserMenu: true,
    stickyHeader: false,
    headerHeight: "64px",
    primaryColor: "#3b82f6",
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Header settings saved:", settings);
      onApply();
    } catch (error) {
      console.error("Error saving header settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="space-y-4">
      <Box className="text-center pb-4">
        <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
          Header & Main Layout Settings
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Customize your website header, navigation, and main layout
        </Typography>
      </Box>

      <Divider />

      <Box className="space-y-4">
        <TextField
          label="Site Title"
          value={settings.siteTitle}
          onChange={(e) => handleSettingChange("siteTitle", e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="Tagline"
          value={settings.tagline}
          onChange={(e) => handleSettingChange("tagline", e.target.value)}
          fullWidth
          size="small"
          multiline
          rows={2}
        />

        <TextField
          label="Header Height"
          value={settings.headerHeight}
          onChange={(e) => handleSettingChange("headerHeight", e.target.value)}
          fullWidth
          size="small"
          helperText="e.g., 64px, 80px, 100px"
        />

        <TextField
          label="Primary Color"
          value={settings.primaryColor}
          onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
          fullWidth
          size="small"
          helperText="Hex color code (e.g., #3b82f6)"
        />

        <Divider />

        <Box className="space-y-3">
          <FormControlLabel
            control={
              <Switch
                checked={settings.showSearch}
                onChange={(e) =>
                  handleSettingChange("showSearch", e.target.checked)
                }
              />
            }
            label="Show Search Bar"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showUserMenu}
                onChange={(e) =>
                  handleSettingChange("showUserMenu", e.target.checked)
                }
              />
            }
            label="Show User Menu"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.stickyHeader}
                onChange={(e) =>
                  handleSettingChange("stickyHeader", e.target.checked)
                }
              />
            }
            label="Sticky Header"
          />
        </Box>
      </Box>

      <Box className="flex justify-end space-x-3 pt-4">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={<Save />}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Box>
  );
};
