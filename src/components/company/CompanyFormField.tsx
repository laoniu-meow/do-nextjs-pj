"use client";

import React, { forwardRef } from "react";
import { TextField, TextFieldProps, Box, Typography } from "@mui/material";
import { cn } from "@/lib/utils";

interface CompanyFormFieldProps
  extends Omit<TextFieldProps, "variant" | "error"> {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpText?: string;
  variant?: "outlined" | "filled" | "standard";
  customWidth?: string;
}

export const CompanyFormField = forwardRef<
  HTMLDivElement,
  CompanyFormFieldProps
>(
  (
    {
      label,
      name,
      error,
      required,
      disabled,
      className,
      helpText,
      variant = "outlined",
      customWidth,
      ...textFieldProps
    },
    ref
  ) => {
    return (
      <Box className={cn("company-form-field", className)} ref={ref}>
        {/* Enhanced Label */}
        <Typography
          variant="subtitle2"
          sx={{
            color: error ? "#dc2626" : "#374151",
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "8px",
            letterSpacing: "0.025em",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            "&::after": required
              ? { content: '"*"', color: "#dc2626", fontSize: "0.875rem" }
              : {},
          }}
        >
          {label}
        </Typography>

        {/* Enhanced TextField */}
        <TextField
          {...textFieldProps}
          name={name}
          variant={variant}
          required={required}
          disabled={disabled}
          error={!!error}
          size="medium"
          fullWidth
          sx={{
            width: customWidth || "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              fontSize: "0.875rem",
              minHeight: textFieldProps.multiline ? "auto" : "48px",
              background: "#ffffff",
              border: "1px solid",
              borderColor: error ? "#dc2626" : "#d1d5db",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",

              "&:hover": {
                borderColor: error ? "#dc2626" : "#3b82f6",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
                transform: "translateY(-1px)",
              },

              "&.Mui-focused": {
                borderColor: error ? "#dc2626" : "#3b82f6",
                borderWidth: "2px",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                transform: "translateY(-1px)",
              },

              "&.Mui-error": {
                borderColor: "#dc2626",
                "&:hover": {
                  borderColor: "#dc2626",
                  boxShadow: "0 2px 8px rgba(220, 38, 38, 0.15)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
                },
              },

              "& .MuiOutlinedInput-input": {
                padding: "12px 16px",
                height: "auto",
                color: "#1f2937",
                "&::placeholder": {
                  color: "#9ca3af",
                  opacity: 0.8,
                  fontSize: "0.875rem",
                },
              },

              "& .MuiOutlinedInput-inputMultiline": {
                padding: "12px 16px",
                minHeight: "48px",
                lineHeight: "1.5",
                "& textarea": {
                  resize: "vertical",
                  minHeight: "24px",
                },
              },
            },

            "& .MuiFormHelperText-root": {
              marginLeft: 0,
              marginTop: "6px",
              marginBottom: 0,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: error ? "#dc2626" : "#6b7280",
              "&.Mui-error": {
                color: "#dc2626",
              },
            },

            "& .MuiInputLabel-root": {
              display: "none", // We're using custom label above
            },

            ...textFieldProps.sx,
          }}
        />

        {/* Help Text */}
        {helpText && !error && (
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              fontSize: "0.75rem",
              marginTop: "6px",
              marginLeft: "4px",
              fontStyle: "italic",
            }}
          >
            {helpText}
          </Typography>
        )}
      </Box>
    );
  }
);

CompanyFormField.displayName = "CompanyFormField";
