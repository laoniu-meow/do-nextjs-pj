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

      // Don't navigate immediately for items with children
      // Only navigate if there are no children or if it's a leaf node
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

  // Remove hover functionality - sub-menus only expand on click
  // const handleItemHover = (item: MenuItem) => {
  //   if (item.children && item.children.length > 0) {
  //     setExpandedItems((prev) => new Set([...prev, item.id]));
  //   }
  // };

  // const handleItemLeave = (item: MenuItem) => {
  //   // Optional: Auto-collapse on mouse leave
  //   // Uncomment the following lines if you want auto-collapse behavior
  //   // if (item.children && item.children.length > 0) {
  //   //   setExpandedItems(prev => {
  //   //     const newSet = new Set(prev);
  //   //     newSet.delete(item.id);
  //   //     return newSet;
  //   //   });
  //   // }
  // };

  const renderMenuItem = (item: MenuItem, index: number, level: number = 0) => {
    const IconComponent = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isClickable = item.href || item.action || hasChildren;

    // Handle variant colors
    const getIconColor = () => {
      if (item.variant === "error") return ADMIN_MENU_THEME.colors.error;
      if (item.variant === "primary") return ADMIN_MENU_THEME.colors.primary;
      if (hasChildren) return ADMIN_MENU_THEME.colors.primary;
      return "inherit";
    };

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            // onMouseEnter={() => handleItemHover(item)}
            // onMouseLeave={() => handleItemLeave(item)}
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
            <ListItemIcon sx={{ color: getIconColor() }}>
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

  const renderDivider = (show: boolean) => {
    return show ? <Divider sx={{ my: 2 }} /> : null;
  };

  return (
    <List sx={{ width: "100%", pt: 1 }} className={className}>
      {menuConfig.mainItems.map((item: MenuItem, index: number) => (
        <React.Fragment key={item.id}>
          {renderMenuItem(item, index)}
          {index < menuConfig.mainItems.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      {renderDivider(menuConfig.mainItems.length > 0)}
      {renderMenuItem(menuConfig.logoutItem, 0)}
    </List>
  );
}
