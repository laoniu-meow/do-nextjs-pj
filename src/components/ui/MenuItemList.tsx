"use client";

import React from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

// Menu Item Interface
export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  children?: MenuItem[];
}

// Menu Item List Props
interface MenuItemListProps {
  items: MenuItem[];
  variant?: "horizontal" | "vertical" | "dropdown";
  size?: "sm" | "md" | "lg";
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  disabledItemClassName?: string;
  onItemClick?: (item: MenuItem) => void;
  renderItem?: (item: MenuItem, index: number) => React.ReactNode;
}

export function MenuItemList({
  items,
  variant = "horizontal",
  size = "md",
  className,
  itemClassName,
  activeItemClassName,
  disabledItemClassName,
  onItemClick,
  renderItem,
}: MenuItemListProps) {
  const { deviceType, isMobile, isTablet } = useResponsive();

  // Get responsive styles based on variant and device
  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      listStyle: "none",
      margin: 0,
      padding: 0,
    };

    switch (variant) {
      case "horizontal":
        return {
          ...baseStyles,
          flexDirection: "row",
          alignItems: "center",
          gap: isMobile ? "8px" : isTablet ? "12px" : "16px",
          flexWrap: isMobile ? "wrap" : "nowrap",
        };

      case "vertical":
        return {
          ...baseStyles,
          flexDirection: "column",
          alignItems: "stretch",
          gap: isMobile ? "4px" : isTablet ? "6px" : "8px",
        };

      case "dropdown":
        return {
          ...baseStyles,
          flexDirection: "column",
          alignItems: "stretch",
          gap: "2px",
          minWidth: isMobile ? "200px" : "250px",
        };

      default:
        return baseStyles;
    }
  };

  // Get responsive item styles
  const getItemStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      borderRadius: "6px",
    };

    // Size-based styles
    const sizeStyles = {
      sm: {
        padding: isMobile ? "6px 8px" : "8px 12px",
        fontSize: isMobile ? "12px" : "14px",
      },
      md: {
        padding: isMobile ? "8px 12px" : "10px 16px",
        fontSize: isMobile ? "14px" : "16px",
      },
      lg: {
        padding: isMobile ? "12px 16px" : "14px 20px",
        fontSize: isMobile ? "16px" : "18px",
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
    };
  };

  // Handle item click
  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    } else if (onItemClick) {
      onItemClick(item);
    }
  };

  // Default item renderer
  const defaultRenderItem = (item: MenuItem, index: number) => (
    <li
      key={item.id}
      className={cn(
        "menu-item",
        `menu-item-${variant}`,
        `menu-item-${size}`,
        {
          "menu-item-active": item.active,
          "menu-item-disabled": item.disabled,
          "menu-item-has-children": item.children && item.children.length > 0,
        },
        itemClassName,
        item.active && activeItemClassName,
        item.disabled && disabledItemClassName
      )}
      style={getItemStyles()}
      onClick={() => handleItemClick(item)}
      role="menuitem"
      aria-disabled={item.disabled}
      aria-current={item.active ? "page" : undefined}
    >
      <div className="menu-item-content">
        {item.icon && <span className="menu-item-icon">{item.icon}</span>}
        <span className="menu-item-label">{item.label}</span>
        {item.children && item.children.length > 0 && (
          <span className="menu-item-arrow">
            {/* Arrow icon can be added here */}
          </span>
        )}
      </div>

      {/* Render nested children if they exist */}
      {item.children && item.children.length > 0 && (
        <MenuItemList
          items={item.children}
          variant="dropdown"
          size={size}
          className="menu-item-children"
          onItemClick={onItemClick}
          renderItem={renderItem}
        />
      )}
    </li>
  );

  // Use custom renderer if provided, otherwise use default
  const renderMenuItem = renderItem || defaultRenderItem;

  return (
    <ul
      className={cn(
        "menu-item-list",
        `menu-item-list-${variant}`,
        `menu-item-list-${size}`,
        className
      )}
      style={getContainerStyles()}
      role="menu"
    >
      {items.map((item, index) => renderMenuItem(item, index))}
    </ul>
  );
}

// Export types for external use
export type { MenuItemListProps };
