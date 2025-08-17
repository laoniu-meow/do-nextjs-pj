"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";
import { MenuItem } from "@/components/ui/config/menuConfig";

interface NavigationProps {
  items: MenuItem[];
  variant?: "horizontal" | "vertical" | "mobile" | "drawer";
  orientation?: "top" | "left" | "right" | "bottom";
  className?: string;
  onItemClick?: (item: MenuItem) => void;
  showIcons?: boolean;
  expandable?: boolean;
  maxDepth?: number;
}

export function Navigation({
  items,
  variant = "horizontal",
  orientation = "top",
  className,
  onItemClick,
  showIcons = true,
  expandable = false,
  maxDepth = 2,
}: NavigationProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { isMobile } = useResponsive();
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    if (expandable && item.children && item.children.length > 0) {
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
  };

  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "12px" : "16px",
    };

    switch (variant) {
      case "vertical":
        return {
          ...baseStyles,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
        };
      case "mobile":
        return {
          ...baseStyles,
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0",
          width: "100%",
        };
      case "drawer":
        return {
          ...baseStyles,
          flexDirection: "column",
          alignItems: "stretch",
          gap: "4px",
          width: "100%",
        };
      default:
        return {
          ...baseStyles,
          flexDirection: "row",
          flexWrap: isMobile ? "wrap" : "nowrap",
        };
    }
  };

  const getOrientationStyles = () => {
    switch (orientation) {
      case "left":
        return "flex-col items-start";
      case "right":
        return "flex-col items-end";
      case "bottom":
        return "flex-col items-center";
      case "top":
      default:
        return "flex-row items-center";
    }
  };

  const renderMenuItem = (
    item: MenuItem,
    level: number = 0
  ): React.ReactNode => {
    if (level > maxDepth) return null;

    const IconComponent = item.icon;
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isExpanded = expandedItems.has(item.id);
    const isClickable = item.href || item.action || (expandable && hasChildren);

    const itemStyles = cn(
      "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200",
      {
        "cursor-pointer hover:bg-gray-100": isClickable,
        "cursor-default opacity-60": !isClickable,
        "bg-blue-50 text-blue-700": item.variant === "primary",
        "text-red-600": item.variant === "error",
        "pl-6": level > 0,
      }
    );

    return (
      <div key={item.id} className="w-full">
        <div
          className={itemStyles}
          onClick={() => handleItemClick(item)}
          role={isClickable ? "button" : undefined}
          tabIndex={isClickable ? 0 : undefined}
        >
          {showIcons && IconComponent && (
            <IconComponent className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="flex-1 text-sm font-medium">{item.text}</span>
          {expandable && hasChildren && (
            <svg
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExpanded ? "rotate-180" : ""
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>

        {expandable && hasChildren && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="ml-4 border-l border-gray-200">
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={cn(
        "navigation",
        `nav-${variant}`,
        getOrientationStyles(),
        className
      )}
      style={getVariantStyles()}
    >
      {items.map((item) => renderMenuItem(item))}
    </nav>
  );
}

// Convenience components for common navigation patterns
export function HorizontalNavigation(props: Omit<NavigationProps, "variant">) {
  return <Navigation variant="horizontal" {...props} />;
}

export function VerticalNavigation(props: Omit<NavigationProps, "variant">) {
  return <Navigation variant="vertical" {...props} />;
}

export function MobileNavigation(props: Omit<NavigationProps, "variant">) {
  return <Navigation variant="mobile" {...props} />;
}

export function DrawerNavigation(props: Omit<NavigationProps, "variant">) {
  return <Navigation variant="drawer" {...props} />;
}
