"use client";

import React from "react";
import { Box, BoxProps } from "@mui/material";

interface IconWrapperProps extends BoxProps {
  icon: React.ComponentType;
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
}

export default function IconWrapper({
  icon: Icon,
  size = "medium",
  color = "inherit",
  className,
  ...boxProps
}: IconWrapperProps) {
  const getIconSize = () => {
    switch (size) {
      case "small":
        return "1rem";
      case "large":
        return "2rem";
      default:
        return "1.5rem";
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        fontSize: getIconSize(),
      }}
      {...boxProps}
    >
      <Icon />
    </Box>
  );
}
