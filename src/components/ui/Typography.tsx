"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RESPONSIVE_TYPOGRAPHY } from "./constants/theme";
import { useResponsive } from "@/hooks/useResponsive";

interface ResponsiveTypographyProps {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "small"
    | "caption";
  children: React.ReactNode;
  className?: string;
  color?:
    | "primary"
    | "secondary"
    | "muted"
    | "error"
    | "success"
    | "warning"
    | "inherit";
  align?: "left" | "center" | "right" | "justify";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  truncate?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Typography({
  variant,
  children,
  className,
  color = "inherit",
  align = "left",
  weight = "normal",
  truncate = false,
  as,
}: ResponsiveTypographyProps) {
  const { deviceType } = useResponsive();

  // Use consolidated theme values
  const fontSize =
    RESPONSIVE_TYPOGRAPHY[variant][
      deviceType === "largeDesktop" ? "desktop" : deviceType
    ];

  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "text-blue-600";
      case "secondary":
        return "text-gray-600";
      case "muted":
        return "text-gray-500";
      case "error":
        return "text-red-600";
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "inherit":
      default:
        return "text-inherit";
    }
  };

  const getWeightClasses = () => {
    switch (weight) {
      case "light":
        return "font-light";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      case "extrabold":
        return "font-extrabold";
      case "normal":
      default:
        return "font-normal";
    }
  };

  const getAlignClasses = () => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      case "left":
      default:
        return "text-left";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "h1":
        return "font-bold tracking-tight";
      case "h2":
        return "font-semibold tracking-tight";
      case "h3":
        return "font-semibold";
      case "h4":
        return "font-medium";
      case "h5":
        return "font-medium";
      case "h6":
        return "font-medium";
      case "body":
        return "leading-relaxed";
      case "small":
        return "leading-relaxed";
      case "caption":
        return "leading-relaxed";
      default:
        return "";
    }
  };

  const typographyStyles = cn(
    getColorClasses(),
    getWeightClasses(),
    getAlignClasses(),
    getVariantClasses(),
    truncate && "truncate",
    className
  );

  const defaultElement = variant.startsWith("h") ? variant : "p";
  const Component = as || defaultElement;

  const style = {
    fontSize,
    lineHeight: variant.startsWith("h") ? "1.2" : "1.6",
  };

  return (
    <Component className={typographyStyles} style={style}>
      {children}
    </Component>
  );
}

// Convenience components for common use cases
export function Heading1({
  children,
  ...props
}: Omit<ResponsiveTypographyProps, "variant">) {
  return (
    <Typography variant="h1" {...props}>
      {children}
    </Typography>
  );
}

export function Heading2({
  children,
  ...props
}: Omit<ResponsiveTypographyProps, "variant">) {
  return (
    <Typography variant="h2" {...props}>
      {children}
    </Typography>
  );
}

export function Heading3({
  children,
  ...props
}: Omit<ResponsiveTypographyProps, "variant">) {
  return (
    <Typography variant="h3" {...props}>
      {children}
    </Typography>
  );
}

export function Body({
  children,
  ...props
}: Omit<ResponsiveTypographyProps, "variant">) {
  return (
    <Typography variant="body" {...props}>
      {children}
    </Typography>
  );
}

export function Small({
  children,
  ...props
}: Omit<ResponsiveTypographyProps, "variant">) {
  return (
    <Typography variant="small" {...props}>
      {children}
    </Typography>
  );
}

export function Caption({
  children,
  ...props
}: Omit<ResponsiveTypographyProps, "variant">) {
  return (
    <Typography variant="caption" {...props}>
      {children}
    </Typography>
  );
}
