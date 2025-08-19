"use client";

import React from "react";
import { Typography, Box, Breadcrumbs, Paper } from "@mui/material";
import { Container } from "@/components/ui/core/Container";
import BreadcrumbItem from "../navigation/BreadcrumbItem";
import { cn } from "@/lib/utils";
import { designSystem } from "@/styles/design-system";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemData[];
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
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
  // Extract breadcrumb rendering logic with improved design
  const renderBreadcrumbs = (breadcrumbItems: BreadcrumbItemData[]) => (
    <Box
      className="mb-8 mt-6"
      sx={{
        "& .MuiBreadcrumbs-root": {
          "& .MuiBreadcrumbs-ol": {
            gap: designSystem.spacing.SM,
          },
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: designSystem.colors.surface.secondary,
          border: `1px solid ${designSystem.colors.neutral[200]}`,
          borderRadius: designSystem.borderRadius.lg,
          padding: designSystem.spacing.MD,
          "&:hover": {
            background: designSystem.colors.surface.tertiary,
            borderColor: designSystem.colors.neutral[300],
            transition: designSystem.transitions.normal,
          },
        }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={
            <Box
              component="span"
              sx={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: designSystem.colors.neutral[400],
                display: "inline-block",
              }}
            />
          }
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
      </Paper>
    </Box>
  );

  return (
    <Container
      maxWidth={maxWidth}
      padding="lg"
      className={cn("page-layout-container", className)}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && renderBreadcrumbs(breadcrumbs)}

      {/* Page Header with improved typography and spacing */}
      <Box
        className="mb-10"
        sx={{
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-24px",
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${designSystem.colors.neutral[200]} 50%, transparent 100%)`,
          },
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: designSystem.typography.fontSize.H1,
            color: designSystem.colors.text.primary,
            marginBottom: designSystem.spacing.MD,
            fontWeight: 700,
            textShadow: "none",
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body1"
            sx={{
              ...designSystem.typography.body1,
              color: designSystem.colors.text.secondary,
              maxWidth: "48rem",
              lineHeight: 1.7,
              marginBottom: 0,
              opacity: 0.9,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Page Content with improved spacing */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
