import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { designSystem } from "@/styles/design-system";
import { Box } from "@mui/material";

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "outline"
    | "ghost";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  sx,
  ...props
}) => {
  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: designSystem.borderRadius.md,
      textTransform: "none" as const,
      fontWeight: 600,
      transition: designSystem.transitions.normal,
      position: "relative" as const,
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: designSystem.shadows.lg,
      },
      "&:active": {
        transform: "translateY(0)",
      },
      "&:disabled": {
        transform: "none",
        boxShadow: "none",
        cursor: "not-allowed",
      },
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyles,
          background: designSystem.colors.primary[600],
          color: designSystem.colors.text.inverse,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: designSystem.colors.primary[700],
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.neutral[300],
            color: designSystem.colors.text.disabled,
          },
        };

      case "secondary":
        return {
          ...baseStyles,
          background: designSystem.colors.surface.primary,
          color: designSystem.colors.text.primary,
          border: `1px solid ${designSystem.colors.neutral[300]}`,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: designSystem.colors.surface.secondary,
            borderColor: designSystem.colors.neutral[400],
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.surface.tertiary,
            color: designSystem.colors.text.disabled,
            borderColor: designSystem.colors.neutral[200],
          },
        };

      case "success":
        return {
          ...baseStyles,
          background: designSystem.colors.success[600],
          color: designSystem.colors.text.inverse,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: designSystem.colors.success[700],
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.neutral[300],
            color: designSystem.colors.text.disabled,
          },
        };

      case "warning":
        return {
          ...baseStyles,
          background: designSystem.colors.warning[600],
          color: designSystem.colors.text.inverse,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: designSystem.colors.warning[700],
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.neutral[300],
            color: designSystem.colors.text.disabled,
          },
        };

      case "error":
        return {
          ...baseStyles,
          background: designSystem.colors.error[600],
          color: designSystem.colors.text.inverse,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: designSystem.colors.error[700],
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.neutral[300],
            color: designSystem.colors.text.disabled,
          },
        };

      case "outline":
        return {
          ...baseStyles,
          background: "transparent",
          color: designSystem.colors.primary[600],
          border: `2px solid ${designSystem.colors.primary[600]}`,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: designSystem.colors.primary[50],
            borderColor: designSystem.colors.primary[700],
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: "transparent",
            color: designSystem.colors.text.disabled,
            borderColor: designSystem.colors.neutral[300],
          },
        };

      case "ghost":
        return {
          ...baseStyles,
          background: "transparent",
          color: designSystem.colors.text.secondary,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: designSystem.colors.neutral[100],
            color: designSystem.colors.text.primary,
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: "transparent",
            color: designSystem.colors.text.disabled,
          },
        };

      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          fontSize: designSystem.typography.caption.fontSize,
          padding: `${designSystem.spacing.xs} ${designSystem.spacing.sm}`,
          minHeight: "32px",
          minWidth: "80px",
        };
      case "large":
        return {
          fontSize: designSystem.typography.body1.fontSize,
          padding: `${designSystem.spacing.md} ${designSystem.spacing.lg}`,
          minHeight: "48px",
          minWidth: "120px",
        };
      default:
        return {
          fontSize: designSystem.typography.body2.fontSize,
          padding: `${designSystem.spacing.sm} ${designSystem.spacing.md}`,
          minHeight: "40px",
          minWidth: "100px",
        };
    }
  };

  const getIconStyles = () => {
    const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20;

    return {
      "& .MuiButton-startIcon": {
        marginRight: designSystem.spacing.xs,
        "& svg": {
          fontSize: iconSize,
        },
      },
      "& .MuiButton-endIcon": {
        marginLeft: designSystem.spacing.xs,
        "& svg": {
          fontSize: iconSize,
        },
      },
    };
  };

  const LoadingSpinner = () => (
    <Box
      sx={{
        display: "inline-block",
        width: size === "small" ? 12 : size === "large" ? 20 : 16,
        height: size === "small" ? 12 : size === "large" ? 20 : 16,
        border: `2px solid transparent`,
        borderTop: `2px solid currentColor`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginRight: leftIcon ? designSystem.spacing.xs : 0,
        marginLeft: rightIcon ? designSystem.spacing.xs : 0,
      }}
    />
  );

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <MuiButton
        variant="contained"
        disabled={disabled || loading}
        startIcon={loading ? <LoadingSpinner /> : leftIcon}
        endIcon={rightIcon}
        sx={{
          ...getVariantStyles(),
          ...getSizeStyles(),
          ...getIconStyles(),
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiButton>
    </>
  );
};

// Button Group Component
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  size?: "small" | "medium" | "large";
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "outline"
    | "ghost";
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = "horizontal",
  size = "medium",
  variant = "primary",
  className,
}) => {
  const getGroupStyles = () => {
    const baseStyles = {
      display: "inline-flex",
      borderRadius: designSystem.borderRadius.md,
      overflow: "hidden",
      boxShadow: designSystem.shadows.sm,
    };

    if (orientation === "vertical") {
      return {
        ...baseStyles,
        flexDirection: "column" as const,
        "& .MuiButton-root": {
          borderRadius: 0,
          "&:first-of-type": {
            borderTopLeftRadius: designSystem.borderRadius.md,
            borderTopRightRadius: designSystem.borderRadius.md,
          },
          "&:last-of-type": {
            borderBottomLeftRadius: designSystem.borderRadius.md,
            borderBottomRightRadius: designSystem.borderRadius.md,
          },
        },
      };
    }

    return {
      ...baseStyles,
      flexDirection: "row" as const,
      "& .MuiButton-root": {
        borderRadius: 0,
        borderRight: `1px solid ${designSystem.colors.neutral[200]}`,
        "&:first-of-type": {
          borderTopLeftRadius: designSystem.borderRadius.md,
          borderBottomLeftRadius: designSystem.borderRadius.md,
        },
        "&:last-of-type": {
          borderTopRightRadius: designSystem.borderRadius.md,
          borderBottomRightRadius: designSystem.borderRadius.md,
          borderRight: "none",
        },
      },
    };
  };

  return (
    <Box sx={getGroupStyles()} className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<ButtonProps>(child)) {
          return React.cloneElement(child, {
            size,
            variant,
            sx: {
              ...(child.props.sx || {}),
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            },
          });
        }
        return child;
      })}
    </Box>
  );
};

export { Button };
export default Button;
