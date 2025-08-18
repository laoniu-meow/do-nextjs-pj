"use client";

import React, { forwardRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";
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
      <div className={cn("company-form-field", className)} ref={ref}>
        <TextField
          {...textFieldProps}
          label={label}
          name={name}
          variant={variant}
          required={required}
          disabled={disabled}
          error={!!error}
          helperText={error || helpText}
          size="medium"
          sx={{
            width: customWidth || "100%",
            marginBottom: "16px",
            textAlign: "left",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: "0.875rem",
              height: textFieldProps.multiline ? "auto" : "36px",
              //boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              transition: "all 0.2s ease-in-out",
              //backgroundColor: "#ffffff",
              textAlign: "left",
              "& .MuiOutlinedInput-notchedOutline": {
                //borderColor: "#d1d5db",
                borderWidth: "0px", //  Remove border line
              },
              "&:hover": {
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fafafa",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
                borderWidth: "0px",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 15px",
                height: "auto",
                textAlign: "left",
                "&::placeholder": {
                  color: "#9ca3af",
                  opacity: 0.8,
                },
              },
              "& .MuiOutlinedInput-inputMultiline": {
                padding: "6px 16px",
                textAlign: "left",
                "&::placeholder": {
                  color: "#9ca3af",
                  opacity: 0.8,
                },
                "& textarea": {
                  textAlign: "left !important",
                  textAlignLast: "left !important",
                },
              },
            },
            "& .MuiInputLabel-root": {
              color: "#374151",
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "6px",
              letterSpacing: "0.025em",
              textAlign: "left",
              "&:focus": {
                color: "#3b82f6",
              },
            },
            "& .MuiFormHelperText-root": {
              marginLeft: 0,
              fontSize: "0.75rem",
              marginTop: "2px",
              marginBottom: 0,
              textAlign: "left",
              "&.Mui-error": {
                color: "#dc2626",
              },
            },
            ...textFieldProps.sx,
          }}
        />
      </div>
    );
  }
);

CompanyFormField.displayName = "CompanyFormField";
