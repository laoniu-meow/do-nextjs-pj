"use client";

import React from "react";
import { Box, Paper } from "@mui/material";
import { Typography } from "@/components/ui";
import { designSystem } from "@/styles/design-system";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: "default" | "elevated" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  compactHeader?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = "default",
  size = "md",
  headerAction,
  footer,
  className,
  compactHeader = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return {
          background: `linear-gradient(135deg, ${designSystem.colors.surface.primary} 0%, ${designSystem.colors.surface.secondary} 100%)`,
          border: "none",
          boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
          "&:hover": {
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)`,
            transform: "translateY(-4px)",
          },
        };
      case "outlined":
        return {
          background: `linear-gradient(135deg, ${designSystem.colors.surface.primary} 0%, ${designSystem.colors.surface.secondary} 100%)`,
          border: `1px solid ${designSystem.colors.neutral[200]}`,
          boxShadow: "none",
          "&:hover": {
            borderColor: designSystem.colors.neutral[300],
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.08)`,
            transform: "translateY(-2px)",
          },
        };
      case "filled":
        return {
          background: `linear-gradient(135deg, ${designSystem.colors.surface.secondary} 0%, ${designSystem.colors.surface.tertiary} 100%)`,
          border: "none",
          boxShadow: "none",
          "&:hover": {
            background: `linear-gradient(135deg, ${designSystem.colors.surface.tertiary} 0%, ${designSystem.colors.neutral[200]} 100%)`,
            transform: "translateY(-1px)",
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.06)`,
          },
        };
      default:
        return {
          background: `linear-gradient(135deg, ${designSystem.colors.surface.primary} 0%, ${designSystem.colors.surface.secondary} 100%)`,
          border: `1px solid ${designSystem.colors.neutral[200]}`,
          boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
          "&:hover": {
            boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
            borderColor: designSystem.colors.neutral[300],
            transform: "translateY(-2px)",
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          padding: designSystem.spacing.md,
          borderRadius: designSystem.borderRadius.md,
        };
      case "lg":
        return {
          padding: designSystem.spacing.xl,
          borderRadius: designSystem.borderRadius.xl,
        };
      default:
        return {
          padding: designSystem.spacing.lg,
          borderRadius: designSystem.borderRadius.lg,
        };
    }
  };

  return (
    <Paper
      elevation={0}
      className={cn("card-enhanced focus-enhanced", className)}
      sx={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        position: "relative",
        "&::before":
          variant === "elevated"
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${designSystem.colors.primary[500]} 0%, ${designSystem.colors.primary[600]} 25%, ${designSystem.colors.primary[700]} 50%, ${designSystem.colors.primary[600]} 75%, ${designSystem.colors.primary[500]} 100%)`,
                borderRadius: `${getSizeStyles().borderRadius} ${
                  getSizeStyles().borderRadius
                } 0 0`,
                boxShadow: `0 2px 8px ${designSystem.colors.primary[500]}40`,
              }
            : {},
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at top right, ${designSystem.colors.primary[50]}15 0%, transparent 50%)`,
          pointerEvents: "none",
          borderRadius: getSizeStyles().borderRadius,
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover::after": {
          opacity: 1,
        },
      }}
    >
      {/* Header Section */}
      {(title || subtitle || headerAction) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom:
              title || subtitle
                ? compactHeader
                  ? designSystem.spacing.sm
                  : designSystem.spacing.lg
                : 0,
            paddingBottom:
              title || subtitle
                ? compactHeader
                  ? designSystem.spacing.xs
                  : designSystem.spacing.md
                : 0,
            borderBottom:
              title || subtitle
                ? `1px solid ${designSystem.colors.neutral[200]}`
                : "none",
          }}
        >
          <Box sx={{ flex: 1 }}>
            {title && (
              <Typography
                variant="h5"
                sx={{
                  ...designSystem.typography.h5,
                  color: designSystem.colors.text.primary,
                  marginBottom: subtitle ? designSystem.spacing.xs : 0,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  ...designSystem.typography.body2,
                  color: designSystem.colors.text.secondary,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {headerAction && (
            <Box sx={{ marginLeft: designSystem.spacing.md }}>
              {headerAction}
            </Box>
          )}
        </Box>
      )}

      {/* Content Section */}
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>

      {/* Footer Section */}
      {footer && (
        <Box
          sx={{
            marginTop: designSystem.spacing.lg,
            paddingTop: designSystem.spacing.md,
            borderTop: `1px solid ${designSystem.colors.neutral[200]}`,
          }}
        >
          {footer}
        </Box>
      )}
    </Paper>
  );
};

// Card Header Component
interface CardHeaderProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  icon,
  action,
  className,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: designSystem.spacing.lg,
      paddingBottom: designSystem.spacing.md,
      borderBottom: `1px solid ${designSystem.colors.neutral[200]}`,
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "40px",
        height: "2px",
        background: `linear-gradient(90deg, ${designSystem.colors.primary[500]} 0%, ${designSystem.colors.primary[600]} 100%)`,
        borderRadius: designSystem.borderRadius.full,
      },
    }}
    className={className}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
      }}
    >
      {icon && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: designSystem.borderRadius.lg,
            background: `linear-gradient(135deg, ${designSystem.colors.primary[50]} 0%, ${designSystem.colors.primary[100]} 100%)`,
            color: designSystem.colors.primary[600],
            marginRight: designSystem.spacing.md,
            boxShadow: `0 2px 8px ${designSystem.colors.primary[500]}20`,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: `0 4px 12px ${designSystem.colors.primary[500]}30`,
            },
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
    {action && <Box sx={{ marginLeft: designSystem.spacing.md }}>{action}</Box>}
  </Box>
);

// Card Content Component
interface CardContentProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  padding = "md",
  className,
}) => {
  const getPadding = () => {
    switch (padding) {
      case "none":
        return 0;
      case "sm":
        return designSystem.spacing.sm;
      case "lg":
        return designSystem.spacing.lg;
      default:
        return designSystem.spacing.md;
    }
  };

  return (
    <Box
      sx={{
        padding: getPadding(),
      }}
      className={className}
    >
      {children}
    </Box>
  );
};

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <Box
    sx={{
      marginTop: designSystem.spacing.lg,
      paddingTop: designSystem.spacing.md,
      borderTop: `1px solid ${designSystem.colors.neutral[200]}`,
    }}
    className={className}
  >
    {children}
  </Box>
);

export { Card, CardHeader, CardContent as CardBody, CardFooter };
export default Card;
