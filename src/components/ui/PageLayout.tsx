"use client";

import React from "react";
import { Container, Typography, Box, Breadcrumbs, Link } from "@mui/material";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
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
  return (
    <Container maxWidth={maxWidth} className={className}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Box className="mb-6">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="p-3 bg-gray-50 rounded-lg"
          >
            {breadcrumbs.map((crumb, index) => {
              if (crumb.href) {
                return (
                  <Link
                    key={index}
                    href={crumb.href}
                    color="text.secondary"
                    underline="hover"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {crumb.label}
                  </Link>
                );
              } else {
                return (
                  <Typography
                    key={index}
                    color="primary"
                    className="font-semibold text-blue-600"
                  >
                    {crumb.label}
                  </Typography>
                );
              }
            })}
          </Breadcrumbs>
        </Box>
      )}

      {/* Page Header */}
      <Box className="mb-8">
        <Typography
          variant="h3"
          component="h1"
          className="font-bold text-gray-800 mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body1"
            color="text.secondary"
            className="max-w-3xl text-base sm:text-lg text-gray-600 leading-relaxed"
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
