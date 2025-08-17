"use client";

import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MenuItem, MenuConfig, defaultMenuConfig } from "./config/menuConfig";
import { ADMIN_MENU_THEME } from "./constants/theme";

interface MenuItemListProps {
  config?: MenuConfig;
  onClose?: () => void;
  onItemClick?: (item: MenuItem) => void;
  className?: string;
}

export default function MenuItemList({
  config,
  onClose,
  onItemClick,
  className,
}: MenuItemListProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Use provided config or default
  const menuConfig = config || defaultMenuConfig;

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    }
    if (onItemClick) {
      onItemClick(item);
    }
    if (onClose) {
      onClose();
    }
  };

  const renderMenuItem = (item: MenuItem, index: number, isSubItem = false) => {
    const IconComponent = item.icon;
    const color =
      item.variant === "error"
        ? ADMIN_MENU_THEME.colors.error
        : ADMIN_MENU_THEME.colors.primary;

    return (
      <ListItem key={item.id} disablePadding>
        <ListItemButton
          onClick={() => handleItemClick(item)}
          sx={isSubItem ? { pl: 4 } : {}}
        >
          <ListItemIcon sx={{ color }}>
            <IconComponent />
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    );
  };

  const renderDivider = (show: boolean) => {
    return show ? <Divider sx={{ my: 2 }} /> : null;
  };

  return (
    <List sx={{ width: "100%", pt: 1 }} className={className}>
      {/* Main menu items */}
      {menuConfig.mainItems.map((item: MenuItem, index: number) => (
        <React.Fragment key={item.id}>
          {renderMenuItem(item, index)}
          {index < menuConfig.mainItems.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      {renderDivider(menuConfig.mainItems.length > 0)}

      {/* Settings with sub-items */}
      <ListItem disablePadding>
        <ListItemButton onClick={handleSettingsClick}>
          <ListItemIcon sx={{ color: ADMIN_MENU_THEME.colors.primary }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
          {settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>

      <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menuConfig.settingsItems.map((item: MenuItem, index: number) =>
            renderMenuItem(item, index, true)
          )}
        </List>
      </Collapse>

      {renderDivider(menuConfig.settingsItems.length > 0)}

      {/* Logout item */}
      {renderMenuItem(menuConfig.logoutItem, 0)}
    </List>
  );
}

// Import SettingsIcon for the Settings menu item
import SettingsIcon from "@mui/icons-material/Settings";
