"use client";

import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { cn } from "@/lib/utils";

interface CompanyFormSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  showDivider?: boolean;
  required?: boolean;
}

export const CompanyFormSection: React.FC<CompanyFormSectionProps> = ({
  title,
  subtitle,
  children,
  className,
  showDivider = true,
}) => {
  return (
    <Box className={cn("company-form-section", className)}>
      {title && (
        <Box className="mb-4">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-1">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Box
        className="w-full flex justify-center items-center"
        style={{ textAlign: "left" }}
      >
        {children}
      </Box>

      {showDivider && <Divider className="my-3" />}
    </Box>
  );
};
