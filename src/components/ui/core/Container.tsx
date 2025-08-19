"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "card" | "bordered" | "elevated" | "filled";
  as?: keyof React.JSX.IntrinsicElements;
  hover?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
}

export function Container({
  children,
  className,
  fluid = false,
  maxWidth = "lg",
  padding = "md",
  variant = "default",
  as: Component = "div",
  hover = false,
  shadow = "sm",
}: ContainerProps) {
  const { deviceType } = useResponsive();

  const getMaxWidth = () => {
    if (fluid) return "100%";

    switch (maxWidth) {
      case "sm":
        return deviceType === "mobile" ? "100%" : "640px";
      case "md":
        return deviceType === "mobile"
          ? "100%"
          : deviceType === "tablet"
          ? "90%"
          : "768px";
      case "lg":
        return deviceType === "mobile"
          ? "100%"
          : deviceType === "tablet"
          ? "90%"
          : "1200px";
      case "xl":
        return deviceType === "mobile"
          ? "100%"
          : deviceType === "tablet"
          ? "90%"
          : "1400px";
      case "full":
        return "100%";
      default:
        return deviceType === "mobile"
          ? "100%"
          : deviceType === "tablet"
          ? "90%"
          : "1200px";
    }
  };

  const getPadding = () => {
    switch (padding) {
      case "none":
        return "0";
      case "sm":
        return deviceType === "mobile"
          ? "16px"
          : deviceType === "tablet"
          ? "24px"
          : "32px";
      case "md":
        return deviceType === "mobile"
          ? "24px"
          : deviceType === "tablet"
          ? "32px"
          : "48px";
      case "lg":
        return deviceType === "mobile"
          ? "32px"
          : deviceType === "tablet"
          ? "48px"
          : "64px";
      case "xl":
        return deviceType === "mobile"
          ? "48px"
          : deviceType === "tablet"
          ? "64px"
          : "96px";
      default:
        return deviceType === "mobile"
          ? "24px"
          : deviceType === "tablet"
          ? "32px"
          : "48px";
    }
  };

  const getVariantStyles = () => {
    const baseStyles = "w-full rounded-xl transition-all duration-200";

    switch (variant) {
      case "card":
        return `${baseStyles} bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200`;
      case "bordered":
        return `${baseStyles} bg-white border-2 border-gray-200`;
      case "elevated":
        return `${baseStyles} bg-white shadow-lg hover:shadow-xl`;
      case "filled":
        return `${baseStyles} bg-gray-50 border border-gray-200`;
      default:
        return `${baseStyles} bg-white border border-gray-200 shadow-sm`;
    }
  };

  const getShadowStyles = () => {
    if (shadow === "none") return "";

    switch (shadow) {
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow-md";
      case "lg":
        return "shadow-lg";
      default:
        return "shadow-sm";
    }
  };

  const containerStyles: React.CSSProperties = {
    maxWidth: getMaxWidth(),
    padding: getPadding(),
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  };

  const variantClasses = cn(
    getVariantStyles(),
    getShadowStyles(),
    hover && "hover:shadow-md hover:scale-[1.02]",
    className
  );

  return (
    <Component
      className={cn("container", variantClasses)}
      style={containerStyles}
    >
      {children}
    </Component>
  );
}

// Responsive Grid Container
interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  columns?: number | { mobile: number; tablet: number; desktop: number };
  gap?: string | { mobile: string; tablet: string; desktop: string };
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
}

export function GridContainer({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: "16px", tablet: "24px", desktop: "32px" },
  alignItems = "stretch",
  justifyContent = "start",
}: GridContainerProps) {
  const { deviceType } = useResponsive();

  const getColumns = () => {
    if (typeof columns === "number") return columns;
    return columns[deviceType === "largeDesktop" ? "desktop" : deviceType];
  };

  const getGap = () => {
    if (typeof gap === "string") return gap;
    return gap[deviceType === "largeDesktop" ? "desktop" : deviceType];
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
    gap: getGap(),
    alignItems,
    justifyContent,
  };

  return (
    <div className={cn("grid-container", className)} style={gridStyles}>
      {children}
    </div>
  );
}

// Responsive Flex Container
interface FlexContainerProps {
  children: React.ReactNode;
  className?: string;
  direction?:
    | "row"
    | "column"
    | {
        mobile: "row" | "column";
        tablet: "row" | "column";
        desktop: "row" | "column";
      };
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  gap?: string | { mobile: string; tablet: string; desktop: string };
}

export function FlexContainer({
  children,
  className,
  direction = "row",
  wrap = "nowrap",
  alignItems = "stretch",
  justifyContent = "start",
  gap = { mobile: "16px", tablet: "24px", desktop: "32px" },
}: FlexContainerProps) {
  const { deviceType } = useResponsive();

  const getDirection = () => {
    if (typeof direction === "string") return direction;
    return direction[deviceType === "largeDesktop" ? "desktop" : deviceType];
  };

  const getGap = () => {
    if (typeof gap === "string") return gap;
    return gap[deviceType === "largeDesktop" ? "desktop" : deviceType];
  };

  const flexStyles = {
    display: "flex",
    flexDirection: getDirection(),
    flexWrap: wrap,
    alignItems,
    justifyContent,
    gap: getGap(),
  };

  return (
    <div className={cn("flex-container", className)} style={flexStyles}>
      {children}
    </div>
  );
}

// Export ResponsiveContainer as an alias for backward compatibility
export const ResponsiveContainer = Container;
