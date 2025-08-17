"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";

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
  const getSectionStyles = () => {
    switch (variant) {
      case "card":
        return "bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-200";
      case "bordered":
        return "bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8";
      default:
        return "bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm";
    }
  };

  return (
    <Box className={`mb-8 ${className || ""}`}>
      {/* Section Header */}
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

      {/* Responsive Main Box/Card */}
      <Paper
        elevation={0}
        className={`w-full ${getSectionStyles()}`}
        sx={{
          // Responsive breakpoints for all media screens
          "@media (max-width: 640px)": {
            // xs
            padding: "1rem",
            margin: "0.5rem",
          },
          "@media (min-width: 641px) and (max-width: 768px)": {
            // sm
            padding: "1.5rem",
            margin: "1rem",
          },
          "@media (min-width: 769px) and (max-width: 1024px)": {
            // md
            padding: "2rem",
            margin: "1.5rem",
          },
          "@media (min-width: 1025px)": {
            // lg and above
            padding: "2rem",
            margin: "2rem",
          },
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
