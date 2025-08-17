"use client";

import React from "react";
import { Container, Typography, Box, Breadcrumbs } from "@mui/material";
import BreadcrumbItem from "./BreadcrumbItem";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemData[];
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function PageLayout({
  title,
  description,
  breadcrumbs,
  children,
  maxWidth = "lg",
  className,
}: PageLayoutProps) {
  // Extract breadcrumb rendering logic
  const renderBreadcrumbs = (breadcrumbItems: BreadcrumbItemData[]) => (
    <Box className="mb-6">
      <Breadcrumbs
        aria-label="breadcrumb"
        className="p-3 bg-gray-50 rounded-lg"
      >
        {breadcrumbItems.map((crumb, index) => (
          <BreadcrumbItem
            key={`${crumb.label}-${index}`}
            label={crumb.label}
            href={crumb.href}
            isActive={index === breadcrumbItems.length - 1}
          />
        ))}
      </Breadcrumbs>
    </Box>
  );

  return (
    <Container
      maxWidth={maxWidth}
      className={className}
      sx={{
        "@media (max-width: 640px)": {
          maxWidth: "100%",
          paddingLeft: "0.25rem",
          paddingRight: "0.25rem",
        },
        "@media (min-width: 641px) and (max-width: 768px)": {
          paddingLeft: "1rem",
          paddingRight: "1rem",
        },
        "@media (min-width: 769px)": {
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        },
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && renderBreadcrumbs(breadcrumbs)}

      {/* Page Header */}
      <Box className="mb-8">
        <Typography
          variant="h4"
          component="h1"
          className="font-bold text-gray-800 mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl"
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body1"
            color="text.secondary"
            className="max-w-3xl text-sm sm:text-base text-gray-600 leading-relaxed mb-1"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "4.5rem", // Ensures consistent height for 3 lines
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Page Content */}
      <Box>{children}</Box>
    </Container>
  );
}
