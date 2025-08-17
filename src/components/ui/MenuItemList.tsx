"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const menuConfig = config || defaultMenuConfig;

  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // Toggle expansion for items with children
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
      return;
    }

    // Handle navigation or action for items without children
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }

    // Call custom item click handler if provided
    if (onItemClick) {
      onItemClick(item);
    }

    // Close the drawer after navigation
    if (onClose) {
      onClose();
    }
  };

  // Extract divider rendering logic
  const renderDivider = (index: number, total: number) =>
    index < total - 1 ? <Divider key={`divider-${index}`} /> : null;

  // Extract icon color logic
  const getIconColor = (item: MenuItem, hasChildren: boolean) => {
    if (item.variant === "error") return ADMIN_MENU_THEME.colors.error;
    if (item.variant === "primary") return ADMIN_MENU_THEME.colors.primary;
    if (hasChildren) return ADMIN_MENU_THEME.colors.primary;
    return "inherit";
  };

  const renderMenuItem = (item: MenuItem, index: number, level: number = 0) => {
    const IconComponent = item.icon;
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isExpanded = expandedItems.has(item.id);
    const isClickable = item.href || item.action || hasChildren;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            disabled={!isClickable}
            sx={{
              pl: level * 2 + 2,
              cursor: isClickable ? "pointer" : "default",
              "&:hover": {
                backgroundColor: isClickable
                  ? "rgba(0, 0, 0, 0.04)"
                  : "transparent",
              },
              "&.Mui-disabled": {
                opacity: 0.6,
              },
            }}
          >
            <ListItemIcon sx={{ color: getIconColor(item, hasChildren) }}>
              <IconComponent />
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                color:
                  item.variant === "error"
                    ? "error"
                    : hasChildren
                    ? "primary"
                    : "inherit",
              }}
            />
            {hasChildren &&
              (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child, childIndex) =>
                renderMenuItem(child, childIndex, level + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <List sx={{ width: "100%", pt: 1 }} className={className}>
      {menuConfig.mainItems.map((item: MenuItem, index: number) => (
        <React.Fragment key={item.id}>
          {renderMenuItem(item, index)}
          {renderDivider(index, menuConfig.mainItems.length)}
        </React.Fragment>
      ))}
      {menuConfig.mainItems.length > 0 && <Divider sx={{ my: 2 }} />}
      {renderMenuItem(menuConfig.logoutItem, 0)}
    </List>
  );
}
