'use client'

import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface ResponsiveButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | { mobile: string; tablet: string; desktop: string };
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean | { mobile: boolean; tablet: boolean; desktop: boolean };
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function ResponsiveButton({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = "button",
}: ResponsiveButtonProps) {
  const { deviceType } = useResponsive();

  const getSize = (): "sm" | "md" | "lg" | "xl" => {
    if (typeof size === "string") return size;

    const deviceSize = deviceType === "largeDesktop" ? "desktop" : deviceType;
    return (size as Record<string, "sm" | "md" | "lg" | "xl">)[deviceSize] || "md";
  };

  const getFullWidth = () => {
    if (typeof fullWidth === "boolean") return fullWidth;

    const deviceFullWidth =
      deviceType === "largeDesktop" ? "desktop" : deviceType;
    return fullWidth[deviceFullWidth] || false;
  };

  const getResponsiveStyles = () => {
    const baseStyles = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      borderRadius: "8px",
      fontWeight: "500",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
      textDecoration: "none",
      width: getFullWidth() ? "100%" : "auto",
    };

    // Size-based styles
    const sizeStyles = {
      sm: {
        padding: deviceType === "mobile" ? "8px 16px" : "10px 20px",
        fontSize: deviceType === "mobile" ? "12px" : "14px",
        minHeight: deviceType === "mobile" ? "32px" : "36px",
      },
      md: {
        padding: deviceType === "mobile" ? "12px 20px" : "14px 24px",
        fontSize: deviceType === "mobile" ? "14px" : "16px",
        minHeight: deviceType === "mobile" ? "40px" : "44px",
      },
      lg: {
        padding: deviceType === "mobile" ? "16px 24px" : "18px 28px",
        fontSize: deviceType === "mobile" ? "16px" : "18px",
        minHeight: deviceType === "mobile" ? "48px" : "52px",
      },
      xl: {
        padding: deviceType === "mobile" ? "20px 32px" : "24px 36px",
        fontSize: deviceType === "mobile" ? "18px" : "20px",
        minHeight: deviceType === "mobile" ? "56px" : "60px",
      },
    };

    // Variant-based styles
    const variantStyles = {
      primary: {
        backgroundColor: "#3b82f6",
        color: "white",
        "&:hover": {
          backgroundColor: "#2563eb",
        },
      },
      secondary: {
        backgroundColor: "#6b7280",
        color: "white",
        "&:hover": {
          backgroundColor: "#4b5563",
        },
      },
      outline: {
        backgroundColor: "transparent",
        color: "#3b82f6",
        border: "2px solid #3b82f6",
        "&:hover": {
          backgroundColor: "#3b82f6",
          color: "white",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "#6b7280",
        "&:hover": {
          backgroundColor: "#f3f4f6",
        },
      },
      danger: {
        backgroundColor: "#ef4444",
        color: "white",
        "&:hover": {
          backgroundColor: "#dc2626",
        },
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[getSize()],
      ...variantStyles[variant],
    };
  };

  const buttonStyles = getResponsiveStyles();

  return (
    <button
      type={type}
      className={cn(
        "responsive-button",
        `btn-${variant}`,
        `btn-${getSize()}`,
        {
          "btn-full-width": getFullWidth(),
          "btn-disabled": disabled,
          "btn-loading": loading,
        },
        className
      )}
      style={buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <div className="loading-spinner" style={{ marginRight: "8px" }}>
          <div className="spinner"></div>
        </div>
      )}
      {children}
    </button>
  );
}

// Responsive Icon Button
interface ResponsiveIconButtonProps {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export function ResponsiveIconButton({
  icon,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  onClick,
  ariaLabel,
}: ResponsiveIconButtonProps) {
  const { deviceType } = useResponsive();

  const getIconSize = () => {
    const sizeMap = {
      sm: deviceType === "mobile" ? "16px" : "18px",
      md: deviceType === "mobile" ? "20px" : "22px",
      lg: deviceType === "mobile" ? "24px" : "26px",
      xl: deviceType === "mobile" ? "28px" : "30px",
    };
    return sizeMap[size];
  };

  const getButtonSize = () => {
    const sizeMap = {
      sm: deviceType === "mobile" ? "32px" : "36px",
      md: deviceType === "mobile" ? "40px" : "44px",
      lg: deviceType === "mobile" ? "48px" : "52px",
      xl: deviceType === "mobile" ? "56px" : "60px",
    };
    return sizeMap[size];
  };

  const iconButtonStyles = {
    width: getButtonSize(),
    height: getButtonSize(),
    padding: "0",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <button
      className={cn(
        "responsive-icon-button",
        `icon-btn-${variant}`,
        `icon-btn-${size}`,
        {
          "icon-btn-disabled": disabled,
        },
        className
      )}
      style={iconButtonStyles}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <div style={{ fontSize: getIconSize() }}>{icon}</div>
    </button>
  );
}
