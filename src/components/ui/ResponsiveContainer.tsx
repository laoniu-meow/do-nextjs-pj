"use client";

import React from "react";
import { Box, BoxProps } from "@mui/material";

interface ResponsiveContainerProps extends BoxProps {
  children: React.ReactNode;
  variant?: "default" | "card" | "bordered";
  className?: string;
}

export default function ResponsiveContainer({
  children,
  variant = "default",
  className,
  ...boxProps
}: ResponsiveContainerProps) {
  const getResponsiveStyles = () => {
    const baseStyles = "w-full";

    switch (variant) {
      case "card":
        return `${baseStyles} bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200`;
      case "bordered":
        return `${baseStyles} bg-white border-2 border-gray-200 rounded-xl`;
      default:
        return `${baseStyles} bg-white border border-gray-200 rounded-xl shadow-sm`;
    }
  };

  const getResponsivePadding = () => ({
    "@media (max-width: 640px)": { padding: "1rem", margin: "0.5rem" },
    "@media (min-width: 641px) and (max-width: 768px)": {
      padding: "1.5rem",
      margin: "1rem",
    },
    "@media (min-width: 769px) and (max-width: 1024px)": {
      padding: "2rem",
      margin: "1.5rem",
    },
    "@media (min-width: 1025px)": { padding: "2rem", margin: "2rem" },
  });

  return (
    <Box
      className={`${getResponsiveStyles()} ${className || ""}`}
      sx={getResponsivePadding()}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
