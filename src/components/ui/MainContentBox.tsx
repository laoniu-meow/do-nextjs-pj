"use client";

import React from "react";
import { Box, BoxProps } from "@mui/material";

interface MainContentBoxProps extends BoxProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "bordered";
  className?: string;
}

export default function MainContentBox({
  children,
  variant = "default",
  className,
  ...boxProps
}: MainContentBoxProps) {
  const getBoxStyles = () => {
    const baseStyles = "w-full";

    switch (variant) {
      case "elevated":
        return `${baseStyles} shadow-2xl border border-blue-400`;
      case "bordered":
        return `${baseStyles} border-2 border-emerald-500 shadow-xl`;
      default:
        return `${baseStyles} border border-gray-400 shadow-lg`;
    }
  };

  const getBackgroundGradient = () => {
    switch (variant) {
      case "elevated":
        return "linear-gradient(135deg, #93c5fd 0%, #bfdbfe 50%, #dbeafe 100%)";
      case "bordered":
        return "linear-gradient(135deg, #6ee7b7 0%, #a7f3d0 50%, #d1fae5 100%)";
      default:
        return "linear-gradient(135deg, #cbd5e1 0%, #e2e8f0 50%, #f1f5f9 100%)";
    }
  };

  const getResponsiveMargin = () => ({
    "@media (max-width: 640px)": { margin: "0.25rem" },
    "@media (min-width: 641px) and (max-width: 768px)": { margin: "0.75rem" },
    "@media (min-width: 769px) and (max-width: 1024px)": { margin: "1rem" },
    "@media (min-width: 1025px)": { margin: "1.25rem" },
  });

  const getInternalPadding = () => ({
    padding: "1rem", // Reduced default internal padding
    "@media (max-width: 640px)": { padding: "0.5rem" },
    "@media (min-width: 641px) and (max-width: 768px)": { padding: "1rem" },
    "@media (min-width: 769px) and (max-width: 1024px)": { padding: "1.25rem" },
    "@media (min-width: 1025px)": { padding: "1.5rem" },
  });

  return (
    <Box
      className={`${getBoxStyles()} ${className || ""}`}
      sx={{
        ...getResponsiveMargin(),
        minHeight: "400px", // Consistent minimum height
        transition: "all 0.2s ease-in-out",
        background: getBackgroundGradient(),
        borderRadius: "8px", // Reduced to subtle, professional border radius
      }}
      {...boxProps}
    >
      <Box sx={getInternalPadding()}>{children}</Box>
    </Box>
  );
}
