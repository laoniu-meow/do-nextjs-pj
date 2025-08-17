"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import ResponsiveContainer from "./ResponsiveContainer";

interface PageSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: "default" | "card" | "bordered";
  className?: string;
}

export default function PageSection({
  title,
  description,
  children,
  variant = "default",
  className,
}: PageSectionProps) {
  // Extract section header rendering logic
  const renderSectionHeader = () => (
    <Box className="mb-6">
      <Typography
        variant="h5"
        component="h2"
        className="font-semibold text-xl sm:text-2xl text-gray-900 mb-3"
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          className="text-sm sm:text-base text-gray-600 max-w-2xl"
        >
          {description}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box className={`mb-8 ${className || ""}`}>
      {/* Section Header */}
      {renderSectionHeader()}

      {/* Responsive Main Box/Card */}
      <ResponsiveContainer variant={variant}>{children}</ResponsiveContainer>
    </Box>
  );
}
