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
      borderRadius: designSystem.borderRadius.lg,
      textTransform: "none" as const,
      fontWeight: 600,
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative" as const,
      border: "none",
      outline: "none",
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      },
      "&:active": {
        transform: "translateY(0)",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      },
      "&:disabled": {
        transform: "none",
        boxShadow: "none",
        cursor: "not-allowed",
        opacity: 0.6,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: designSystem.borderRadius.lg,
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
        opacity: 0,
        transition: "opacity 0.2s ease",
      },
      "&:hover::before": {
        opacity: 1,
      },
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${designSystem.colors.primary[600]} 0%, ${designSystem.colors.primary[700]} 100%)`,
          color: designSystem.colors.text.inverse,
          boxShadow: `0 4px 15px ${designSystem.colors.primary[600]}40`,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: `linear-gradient(135deg, ${designSystem.colors.primary[700]} 0%, ${designSystem.colors.primary[800]} 100%)`,
            boxShadow: `0 10px 25px ${designSystem.colors.primary[600]}50`,
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.neutral[300],
            color: designSystem.colors.text.disabled,
            boxShadow: "none",
          },
        };

      case "secondary":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${designSystem.colors.surface.primary} 0%, ${designSystem.colors.surface.secondary} 100%)`,
          color: designSystem.colors.text.primary,
          border: `1px solid ${designSystem.colors.neutral[300]}`,
          boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: `linear-gradient(135deg, ${designSystem.colors.surface.secondary} 0%, ${designSystem.colors.neutral[200]} 100%)`,
            borderColor: designSystem.colors.neutral[400],
            boxShadow: `0 8px 20px rgba(0, 0, 0, 0.12)`,
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.surface.tertiary,
            color: designSystem.colors.text.disabled,
            borderColor: designSystem.colors.neutral[200],
            boxShadow: "none",
          },
        };

      case "success":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${designSystem.colors.success[600]} 0%, ${designSystem.colors.success[700]} 100%)`,
          color: designSystem.colors.text.inverse,
          boxShadow: `0 4px 15px ${designSystem.colors.success[600]}40`,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: `linear-gradient(135deg, ${designSystem.colors.success[700]} 0%, ${designSystem.colors.success[800]} 100%)`,
            boxShadow: `0 10px 25px ${designSystem.colors.success[600]}50`,
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.neutral[300],
            color: designSystem.colors.text.disabled,
            boxShadow: "none",
          },
        };

      case "warning":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${designSystem.colors.warning[600]} 0%, ${designSystem.colors.warning[700]} 100%)`,
          color: designSystem.colors.text.inverse,
          boxShadow: `0 4px 15px ${designSystem.colors.warning[600]}40`,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: `linear-gradient(135deg, ${designSystem.colors.warning[700]} 0%, ${designSystem.colors.warning[800]} 100%)`,
            boxShadow: `0 10px 25px ${designSystem.colors.warning[600]}50`,
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.neutral[300],
            color: designSystem.colors.text.disabled,
            boxShadow: "none",
          },
        };

      case "error":
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${designSystem.colors.error[600]} 0%, ${designSystem.colors.error[700]} 100%)`,
          color: designSystem.colors.text.inverse,
          boxShadow: `0 4px 15px ${designSystem.colors.error[600]}40`,
          "&:hover": {
            ...baseStyles["&:hover"],
            background: `linear-gradient(135deg, ${designSystem.colors.error[700]} 0%, ${designSystem.colors.error[800]} 100%)`,
            boxShadow: `0 10px 25px ${designSystem.colors.error[600]}50`,
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: designSystem.colors.neutral[300],
            color: designSystem.colors.text.disabled,
            boxShadow: "none",
          },
        };

      case "outline":
        return {
          ...baseStyles,
          background: "transparent",
          color: designSystem.colors.primary[600],
          border: `2px solid ${designSystem.colors.primary[600]}`,
          boxShadow: "none",
          "&:hover": {
            ...baseStyles["&:hover"],
            background: `linear-gradient(135deg, ${designSystem.colors.primary[50]} 0%, ${designSystem.colors.primary[100]} 100%)`,
            borderColor: designSystem.colors.primary[700],
            color: designSystem.colors.primary[700],
            boxShadow: `0 8px 20px ${designSystem.colors.primary[600]}20`,
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: "transparent",
            color: designSystem.colors.text.disabled,
            borderColor: designSystem.colors.neutral[300],
            boxShadow: "none",
          },
        };

      case "ghost":
        return {
          ...baseStyles,
          background: "transparent",
          color: designSystem.colors.text.secondary,
          boxShadow: "none",
          "&:hover": {
            ...baseStyles["&:hover"],
            background: `linear-gradient(135deg, ${designSystem.colors.neutral[100]} 0%, ${designSystem.colors.neutral[200]} 100%)`,
            color: designSystem.colors.text.primary,
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.08)`,
          },
          "&:disabled": {
            ...baseStyles["&:disabled"],
            background: "transparent",
            color: designSystem.colors.text.disabled,
            boxShadow: "none",
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
          padding: `${designSystem.spacing.xs} ${designSystem.spacing.md}`,
          minHeight: "28px",
          minWidth: "88px",
          borderRadius: designSystem.borderRadius.md,
        };
      case "large":
        return {
          fontSize: designSystem.typography.body1.fontSize,
          padding: `${designSystem.spacing.md} ${designSystem.spacing.xl}`,
          minHeight: "44px",
          minWidth: "140px",
          borderRadius: designSystem.borderRadius.xl,
        };
      default:
        return {
          fontSize: designSystem.typography.body2.fontSize,
          padding: `${designSystem.spacing.sm} ${designSystem.spacing.lg}`,
          minHeight: "36px",
          minWidth: "112px",
          borderRadius: designSystem.borderRadius.lg,
        };
    }
  };

  const getIconStyles = () => {
    const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20;

    return {
      "& .MuiButton-startIcon": {
        marginRight: designSystem.spacing.sm,
        "& svg": {
          fontSize: iconSize,
          transition: "transform 0.2s ease",
        },
      },
      "& .MuiButton-endIcon": {
        marginLeft: designSystem.spacing.sm,
        "& svg": {
          fontSize: iconSize,
          transition: "transform 0.2s ease",
        },
      },
      "&:hover .MuiButton-startIcon svg": {
        transform: "scale(1.1)",
      },
      "&:hover .MuiButton-endIcon svg": {
        transform: "scale(1.1)",
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
        marginRight: leftIcon ? designSystem.spacing.sm : 0,
        marginLeft: rightIcon ? designSystem.spacing.sm : 0,
        opacity: 0.8,
        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
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
        className="button-enhanced focus-enhanced"
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
