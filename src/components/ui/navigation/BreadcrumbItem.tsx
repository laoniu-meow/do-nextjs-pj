"use client";

import React from "react";
import { Link, Typography } from "@mui/material";
import { designSystem } from "@/styles/design-system";

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isActive?: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  label,
  href,
  isActive = false,
}) => {
  if (isActive) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: designSystem.colors.text.primary,
          fontWeight: 600,
          fontSize: "0.875rem",
        }}
      >
        {label}
      </Typography>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        sx={{
          color: designSystem.colors.text.secondary,
          textDecoration: "none",
          fontSize: "0.875rem",
          "&:hover": {
            color: designSystem.colors.primary[600],
            textDecoration: "underline",
          },
        }}
      >
        {label}
      </Link>
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{
        color: designSystem.colors.text.secondary,
        fontSize: "0.875rem",
      }}
    >
      {label}
    </Typography>
  );
};

export default BreadcrumbItem;
