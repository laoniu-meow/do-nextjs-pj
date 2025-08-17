"use client";

import React from "react";
import { Typography, Link } from "@mui/material";

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isActive?: boolean;
  className?: string;
}

export default function BreadcrumbItem({
  label,
  href,
  isActive = false,
  className,
}: BreadcrumbItemProps) {
  if (href && !isActive) {
    return (
      <Link
        href={href}
        color="text.secondary"
        underline="hover"
        className={`text-gray-600 hover:text-gray-900 ${className || ""}`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Typography
      color="primary"
      className={`font-semibold text-blue-600 ${className || ""}`}
    >
      {label}
    </Typography>
  );
}
