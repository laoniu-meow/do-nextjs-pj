"use client";

import React from "react";
import { IconButton, Drawer, Box } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import MenuItemList from "./MenuItemList";
import { useMenuState } from "./hooks/useMenuState";
import { ADMIN_MENU_THEME, SPACING } from "./constants/theme";
import { MenuConfig, MenuItem } from "./config/menuConfig";

interface AdminMenuButtonProps {
  className?: string;
  config?: MenuConfig;
  position?: {
    top?: number;
    right?: number;
  };
  onItemClick?: (item: MenuItem) => void;
}

export default function AdminMenuButton({
  className,
  config,
  position = {},
  onItemClick,
}: AdminMenuButtonProps) {
  const {
    isOpen: isDrawerOpen,
    mounted,
    open: openDrawer,
    close: closeDrawer,
  } = useMenuState({ autoClose: false }); // Disable auto-close to prevent interference

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  // Handle backdrop clicks - prevent closing
  const handleBackdropClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Don't close the drawer
  };

  // Handle drawer close attempts - only allow closing for navigation
  const handleDrawerClose = (event: React.SyntheticEvent, reason: string) => {
    // Only allow closing for navigation, not for backdrop clicks
    if (reason === "backdropClick") {
      return; // Prevent closing on backdrop click
    }
    // Allow other close reasons (like programmatic close)
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const buttonTop = position.top ?? ADMIN_MENU_THEME.positioning.top;
  const buttonRight = position.right ?? ADMIN_MENU_THEME.positioning.right;

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        className={className}
        sx={{
          position: "fixed",
          top: buttonTop,
          right: buttonRight,
          zIndex: ADMIN_MENU_THEME.positioning.zIndex,
          width: ADMIN_MENU_THEME.button.size,
          height: ADMIN_MENU_THEME.button.size,
          borderRadius: ADMIN_MENU_THEME.button.borderRadius,
          border: ADMIN_MENU_THEME.button.border,
          backgroundColor: ADMIN_MENU_THEME.button.backgroundColor,
          boxShadow: ADMIN_MENU_THEME.button.shadow,
          "&:hover": {
            backgroundColor: ADMIN_MENU_THEME.button.hoverBackgroundColor,
          },
        }}
        aria-label="Admin menu"
      >
        <WidgetsIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose} // Only prevent backdrop clicks, allow toggle button
        disableEscapeKeyDown={true} // Prevent closing on Escape key
        PaperProps={{
          sx: {
            width: ADMIN_MENU_THEME.drawer.width,
            maxWidth: ADMIN_MENU_THEME.drawer.maxWidth,
          },
        }}
        BackdropProps={{
          onClick: handleBackdropClick,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            pointerEvents: "auto", // Allow backdrop to receive clicks
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            p: SPACING.sm,
            display: "flex",
            justifyContent: "center",
          }}
          role="presentation"
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: ADMIN_MENU_THEME.menu.maxWidth,
              mt: ADMIN_MENU_THEME.menu.topMargin,
            }}
          >
            <MenuItemList
              config={config}
              onClose={() => closeDrawer()}
              onItemClick={onItemClick}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
