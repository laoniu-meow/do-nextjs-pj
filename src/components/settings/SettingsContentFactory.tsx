"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { SettingsPageType } from "@/hooks/useSettingsContent";
import { CompanyProfileSettings } from "./content/CompanyProfileSettings";
import { HeaderMainSettings } from "./content/HeaderMainSettings";

interface SettingsContentFactoryProps {
  pageType: SettingsPageType;
  onApply: () => void;
  onCancel: () => void;
}

export const SettingsContentFactory: React.FC<SettingsContentFactoryProps> = ({
  pageType,
  onApply,
  onCancel,
}) => {
  const renderContent = () => {
    switch (pageType) {
      case "company-profile":
        return <CompanyProfileSettings />;

      case "header-main":
        return <HeaderMainSettings onApply={onApply} onCancel={onCancel} />;

      case "footer":
        return (
          <Box className="text-center py-8">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2"
            >
              Footer Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Configure your website footer, links, and footer-specific content.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Footer settings component will be implemented here.
            </Typography>
          </Box>
        );

      case "hero-page":
        return (
          <Box className="text-center py-8">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2"
            >
              Hero Page Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Set up your hero section, main banner, and landing page content.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Hero page settings component will be implemented here.
            </Typography>
          </Box>
        );

      case "pages":
        return (
          <Box className="text-center py-8">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2"
            >
              Pages Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Manage your website pages, content structure, and page-specific
              settings.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Pages settings component will be implemented here.
            </Typography>
          </Box>
        );

      case "users":
        return (
          <Box className="text-center py-8">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2"
            >
              User Management Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Configure user roles, permissions, and user-related settings.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              User management settings component will be implemented here.
            </Typography>
          </Box>
        );

      case "menu-navigation":
        return (
          <Box className="text-center py-8">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2"
            >
              Menu Navigation Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Configure your website navigation menu structure and behavior.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Menu navigation settings component will be implemented here.
            </Typography>
          </Box>
        );

      case "quick-navigation":
        return (
          <Box className="text-center py-8">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2"
            >
              Quick Navigation Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Set up quick access navigation and shortcuts.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quick navigation settings component will be implemented here.
            </Typography>
          </Box>
        );

      case "dashboard":
        return (
          <Box className="text-center py-8">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2"
            >
              Dashboard Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Configure your dashboard layout, widgets, and display options.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Dashboard settings component will be implemented here.
            </Typography>
          </Box>
        );

      default:
        return (
          <Box className="text-center py-8">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2"
            >
              General Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Configure your application settings.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Select a specific settings page to configure options.
            </Typography>
          </Box>
        );
    }
  };

  return <Box className="settings-content-factory">{renderContent()}</Box>;
};
