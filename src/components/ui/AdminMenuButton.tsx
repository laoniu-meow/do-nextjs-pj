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
  onClose?: () => void;
}

export default function AdminMenuButton({
  className,
  config,
  position = {},
  onItemClick,
  onClose,
}: AdminMenuButtonProps) {
  const {
    isOpen: isDrawerOpen,
    mounted,
    open: openDrawer,
    close: closeDrawer,
  } = useMenuState();

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
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
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: ADMIN_MENU_THEME.drawer.width,
            maxWidth: ADMIN_MENU_THEME.drawer.maxWidth,
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
              onClose={onClose || closeDrawer}
              onItemClick={onItemClick}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
