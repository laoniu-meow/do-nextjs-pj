"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { designSystem } from "@/styles/design-system";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: "default" | "elevated" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
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
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return {
          background: designSystem.colors.surface.primary,
          border: "none",
          boxShadow: designSystem.shadows.lg,
          "&:hover": {
            boxShadow: designSystem.shadows.xl,
            transform: "translateY(-2px)",
          },
        };
      case "outlined":
        return {
          background: designSystem.colors.surface.primary,
          border: `1px solid ${designSystem.colors.neutral[200]}`,
          boxShadow: "none",
          "&:hover": {
            borderColor: designSystem.colors.neutral[300],
            boxShadow: designSystem.shadows.sm,
          },
        };
      case "filled":
        return {
          background: designSystem.colors.surface.secondary,
          border: "none",
          boxShadow: "none",
          "&:hover": {
            background: designSystem.colors.surface.tertiary,
          },
        };
      default:
        return {
          background: designSystem.colors.surface.primary,
          border: `1px solid ${designSystem.colors.neutral[200]}`,
          boxShadow: designSystem.shadows.sm,
          "&:hover": {
            boxShadow: designSystem.shadows.md,
            borderColor: designSystem.colors.neutral[300],
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
      sx={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        transition: designSystem.transitions.normal,
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
                height: "3px",
                background: `linear-gradient(90deg, ${designSystem.colors.primary[500]} 0%, ${designSystem.colors.primary[600]} 100%)`,
                borderRadius: `${getSizeStyles().borderRadius} ${
                  getSizeStyles().borderRadius
                } 0 0`,
              }
            : {},
      }}
      className={className}
    >
      {/* Header Section */}
      {(title || subtitle || headerAction) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: title || subtitle ? designSystem.spacing.lg : 0,
            paddingBottom: title || subtitle ? designSystem.spacing.md : 0,
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
            width: "40px",
            height: "40px",
            borderRadius: designSystem.borderRadius.md,
            background: designSystem.colors.primary[50],
            color: designSystem.colors.primary[600],
            marginRight: designSystem.spacing.md,
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
