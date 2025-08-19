"use client";

import React from "react";
import {
  Typography,
  Box,
  Breadcrumbs,
  Container as MuiContainer,
} from "@mui/material";

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
  // Enhanced breadcrumb rendering with professional design
  const renderBreadcrumbs = (breadcrumbItems: BreadcrumbItemData[]) => (
    <Box
      className="mb-4 mt-8"
      sx={{
        "& .MuiBreadcrumbs-root": {
          "& .MuiBreadcrumbs-ol": {
            gap: designSystem.spacing.SM,
          },
        },
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          <Box
            component="span"
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${designSystem.colors.neutral[400]} 0%, ${designSystem.colors.neutral[500]} 100%)`,
              display: "inline-block",
              margin: "0 8px",
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
    </Box>
  );

  return (
    <MuiContainer
      maxWidth={maxWidth === "full" ? false : maxWidth}
      sx={{
        padding: {
          xs: designSystem.spacing.LG,
          sm: designSystem.spacing.XL,
          md: designSystem.spacing["2XL"],
        },
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
      className={cn(
        "page-layout-container typography-enhanced page-components",
        className
      )}
    >
      {/* Enhanced Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && renderBreadcrumbs(breadcrumbs)}

      {/* Enhanced Page Header with professional styling */}
      <Box
        className="mb-12"
        sx={{
          position: "relative",
          padding: `${designSystem.spacing.MD} 0`,
          "&::before": {
            zIndex: 20,
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${designSystem.colors.neutral[200]} 20%, ${designSystem.colors.neutral[300]} 50%, ${designSystem.colors.neutral[200]} 80%, transparent 100%)`,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${designSystem.colors.neutral[200]} 20%, ${designSystem.colors.neutral[300]} 50%, ${designSystem.colors.neutral[200]} 80%, transparent 100%)`,
          },
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            zIndex: 20,
            fontSize: {
              xs: "2rem",
              sm: "2.25rem",
              md: "2.5rem",
              lg: "3rem",
            },
            color: designSystem.colors.text.primary,
            marginBottom: designSystem.spacing.LG,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            background: `linear-gradient(135deg, ${designSystem.colors.neutral[900]} 0%, ${designSystem.colors.neutral[700]} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-12px",
              left: 0,
              width: "80px",
              height: "4px",
              background: `linear-gradient(90deg, ${designSystem.colors.primary[500]} 0%, ${designSystem.colors.primary[600]} 100%)`,
              borderRadius: designSystem.borderRadius.full,
              boxShadow: `0 4px 12px ${designSystem.colors.primary[500]}40`,
            },
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
              maxWidth: "56rem",
              lineHeight: 1.7,
              marginBottom: 0,
              opacity: 0.85,
              fontSize: {
                xs: "1rem",
                sm: "1.125rem",
              },
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Enhanced Page Content with improved spacing and visual hierarchy */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          "& > *:first-of-type": {
            marginTop: 0,
          },
          "& > *:last-of-type": {
            marginBottom: 0,
          },
        }}
      >
        {children}
      </Box>
    </MuiContainer>
  );
}
