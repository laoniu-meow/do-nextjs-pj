"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RESPONSIVE_TYPOGRAPHY } from "../constants/theme";
import { useResponsive } from "@/hooks/useResponsive";

interface ResponsiveTypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "small"
    | "caption"
    // MUI-compatible aliases
    | "body1"
    | "body2"
    | "subtitle1"
    | "subtitle2"
    | "overline";
  children: React.ReactNode;
  className?: string;
  color?:
    | "primary"
    | "secondary"
    | "muted"
    | "error"
    | "success"
    | "warning"
    | "inherit"
    // Allow MUI tokens or CSS color strings
    | string;
  align?: "left" | "center" | "right" | "justify";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  truncate?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  // MUI-like props support
  component?: keyof React.JSX.IntrinsicElements;
  sx?: React.CSSProperties;
  fontWeight?: number | string;
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
  component,
  sx,
  fontWeight,
}: ResponsiveTypographyProps) {
  const { deviceType } = useResponsive();

  // Use consolidated theme values with runtime guards
  type DeviceKey = "mobile" | "tablet" | "desktop";
  const isVariantKey = (
    value: unknown
  ): value is keyof typeof RESPONSIVE_TYPOGRAPHY =>
    Object.prototype.hasOwnProperty.call(
      RESPONSIVE_TYPOGRAPHY,
      value as PropertyKey
    );

  // Normalize variant to supported keys
  const variantMap: Record<
    ResponsiveTypographyProps["variant"],
    keyof typeof RESPONSIVE_TYPOGRAPHY
  > = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    body: "body",
    small: "small",
    caption: "caption",
    body1: "body",
    body2: "small",
    subtitle1: "body",
    subtitle2: "small",
    overline: "caption",
  };

  // eslint-disable-next-line security/detect-object-injection
  const normalizedVariant = variantMap[variant];
  const safeVariant: keyof typeof RESPONSIVE_TYPOGRAPHY = isVariantKey(
    normalizedVariant
  )
    ? normalizedVariant
    : "body";
  const deviceKey = deviceType === "largeDesktop" ? "desktop" : deviceType;
  const safeDevice: DeviceKey = deviceKey as DeviceKey;

  // eslint-disable-next-line security/detect-object-injection
  const fontSize = RESPONSIVE_TYPOGRAPHY[safeVariant][safeDevice];

  const getColorClasses = () => {
    // Handle common MUI color tokens
    if (color === "text.secondary") return "text-gray-600";
    if (color === "text.primary") return "text-gray-900";
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
      case "body1":
      case "subtitle1":
        return "leading-relaxed";
      case "small":
      case "body2":
      case "subtitle2":
        return "leading-relaxed";
      case "caption":
      case "overline":
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

  // Note: variant mapping handled via variantMap above

  const defaultElement = variant.startsWith("h") ? (variant as string) : "p";
  const Component = (as ||
    component ||
    defaultElement) as keyof React.JSX.IntrinsicElements;

  const style: React.CSSProperties = {
    fontSize,
    lineHeight: variant.startsWith("h") ? "1.2" : "1.6",
    ...(typeof fontWeight !== "undefined" ? { fontWeight } : {}),
    ...(sx || {}),
  };

  // If color is a custom CSS color string (not handled above), apply inline style
  if (
    typeof color === "string" &&
    ![
      "primary",
      "secondary",
      "muted",
      "error",
      "success",
      "warning",
      "inherit",
      "text.secondary",
      "text.primary",
    ].includes(color)
  ) {
    style.color = color as string;
  }

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
