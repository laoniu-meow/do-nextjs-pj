"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RESPONSIVE_SPACING } from "../constants/theme";
import { useResponsive } from "@/hooks/useResponsive";

interface SpacingProps {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  direction?: "horizontal" | "vertical" | "both";
  children?: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Spacing({
  size,
  direction = "both",
  children,
  className,
  as: Component = "div",
}: SpacingProps) {
  const { deviceType } = useResponsive();

  // Use consolidated theme values
  const spacingValue =
    RESPONSIVE_SPACING[size][
      deviceType === "largeDesktop" ? "desktop" : deviceType
    ];

  const getSpacingStyles = () => {
    switch (direction) {
      case "horizontal":
        return {
          paddingLeft: spacingValue,
          paddingRight: spacingValue,
        };
      case "vertical":
        return {
          paddingTop: spacingValue,
          paddingBottom: spacingValue,
        };
      case "both":
        return {
          padding: spacingValue,
        };
      default:
        return {};
    }
  };

  const spacingStyles = getSpacingStyles();

  if (children) {
    return (
      <Component className={cn("spacing", className)} style={spacingStyles}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={cn("spacing", className)}
      style={spacingStyles}
      aria-hidden="true"
    />
  );
}

// Convenience components for common spacing patterns
export function Margin({
  size,
  direction,
  className,
}: Omit<SpacingProps, "children" | "as">) {
  const { deviceType } = useResponsive();

  // Use consolidated theme values
  const spacingValue =
    RESPONSIVE_SPACING[size][
      deviceType === "largeDesktop" ? "desktop" : deviceType
    ];

  const getMarginStyles = () => {
    switch (direction) {
      case "horizontal":
        return {
          marginLeft: spacingValue,
          marginRight: spacingValue,
        };
      case "vertical":
        return {
          marginTop: spacingValue,
          marginBottom: spacingValue,
        };
      case "both":
        return {
          margin: spacingValue,
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={cn("margin", className)}
      style={getMarginStyles()}
      aria-hidden="true"
    />
  );
}

export function Padding({
  size,
  direction,
  className,
  children,
}: SpacingProps) {
  return (
    <Spacing size={size} direction={direction} className={className}>
      {children}
    </Spacing>
  );
}

// Specific spacing components
export function Space({
  size,
  className,
}: {
  size: SpacingProps["size"];
  className?: string;
}) {
  return <Spacing size={size} direction="both" className={className} />;
}

export function VSpace({
  size,
  className,
}: {
  size: SpacingProps["size"];
  className?: string;
}) {
  return <Spacing size={size} direction="vertical" className={className} />;
}

export function HSpace({
  size,
  className,
}: {
  size: SpacingProps["size"];
  className?: string;
}) {
  return <Spacing size={size} direction="horizontal" className={className} />;
}
