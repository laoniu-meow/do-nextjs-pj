"use client";

import React from "react";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

interface RoundIconButtonProps extends Omit<IconButtonProps, "children"> {
  icon: React.ReactNode;
  tooltip?: string;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "small" | "medium" | "large";
}

export default function RoundIconButton({
  icon,
  tooltip,
  variant = "default",
  size = "medium",
  className,
  ...buttonProps
}: RoundIconButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#3b82f6",
          color: "white",
          "&:hover": { backgroundColor: "#2563eb" },
        };
      case "success":
        return {
          backgroundColor: "#10b981",
          color: "white",
          "&:hover": { backgroundColor: "#059669" },
        };
      case "warning":
        return {
          backgroundColor: "#f59e0b",
          color: "white",
          "&:hover": { backgroundColor: "#d97706" },
        };
      case "error":
        return {
          backgroundColor: "#ef4444",
          color: "white",
          "&:hover": { backgroundColor: "#dc2626" },
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          "&:hover": { backgroundColor: "#e5e7eb" },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: "32px", height: "32px" };
      case "large":
        return { width: "48px", height: "48px" };
      default:
        return { width: "40px", height: "40px" };
    }
  };

  const button = (
    <IconButton
      className={className}
      sx={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          ...getVariantStyles()["&:hover"],
          transform: "translateY(-1px)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      }}
      {...buttonProps}
    >
      {icon}
    </IconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow placement="top">
        {button}
      </Tooltip>
    );
  }

  return button;
}
