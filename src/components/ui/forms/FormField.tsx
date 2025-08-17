"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

// Shared interfaces and utilities
interface BaseFormFieldProps {
  label?: string;
  name: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpText?: string;
}

// Shared styling utilities
const useFormFieldStyles = () => {
  const { isMobile } = useResponsive();

  const getInputClasses = (error?: string) => {
    const baseClasses = [
      "w-full rounded-lg border transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    ];

    if (error) {
      baseClasses.push("border-red-300 focus:ring-red-500");
    } else {
      baseClasses.push("border-gray-300 focus:border-blue-500");
    }

    if (isMobile) {
      baseClasses.push("text-base px-3 py-2");
    } else {
      baseClasses.push("text-sm px-4 py-2");
    }

    return cn(baseClasses);
  };

  const getLabelClasses = (required?: boolean, className?: string) => {
    return cn(
      "block font-medium text-gray-700 mb-2",
      isMobile ? "text-base" : "text-sm",
      required && "after:content-['*'] after:ml-1 after:text-red-500",
      className
    );
  };

  const getErrorClasses = (className?: string) => {
    return cn(
      "mt-1 text-sm text-red-600",
      isMobile ? "text-base" : "text-sm",
      className
    );
  };

  return { getInputClasses, getLabelClasses, getErrorClasses };
};

// Base Form Field Wrapper
const FormFieldWrapper = forwardRef<
  HTMLDivElement,
  BaseFormFieldProps & { children: React.ReactNode }
>(
  (
    {
      label,
      name,
      error,
      required,
      className,
      labelClassName,
      errorClassName,
      helpText,
      children,
    },
    ref
  ) => {
    const { getLabelClasses, getErrorClasses } = useFormFieldStyles();

    return (
      <div className={cn("form-field", className)} ref={ref}>
        {label && (
          <label
            htmlFor={name}
            className={getLabelClasses(required, labelClassName)}
          >
            {label}
          </label>
        )}

        {children}

        {helpText && (
          <p id={`${name}-help`} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}

        {error && (
          <p className={getErrorClasses(errorClassName)} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormFieldWrapper.displayName = "FormFieldWrapper";

// Text Input Field
interface TextFieldProps extends BaseFormFieldProps {
  type: "text" | "email" | "password" | "url" | "tel" | "number";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      type,
      value,
      onChange,
      placeholder,
      maxLength,
      minLength,
      pattern,
      ...baseProps
    },
    ref
  ) => {
    const { getInputClasses } = useFormFieldStyles();

    return (
      <FormFieldWrapper {...baseProps}>
        <input
          id={baseProps.name}
          name={baseProps.name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          disabled={baseProps.disabled}
          className={getInputClasses(baseProps.error)}
          aria-describedby={
            baseProps.helpText ? `${baseProps.name}-help` : undefined
          }
          aria-invalid={baseProps.error ? "true" : undefined}
          ref={ref}
        />
      </FormFieldWrapper>
    );
  }
);

TextField.displayName = "TextField";

// Textarea Field
interface TextareaFieldProps extends BaseFormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      rows = 3,
      maxLength,
      minLength,
      ...baseProps
    },
    ref
  ) => {
    const { getInputClasses } = useFormFieldStyles();

    return (
      <FormFieldWrapper {...baseProps}>
        <textarea
          id={baseProps.name}
          name={baseProps.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          minLength={minLength}
          disabled={baseProps.disabled}
          className={getInputClasses(baseProps.error)}
          aria-describedby={
            baseProps.helpText ? `${baseProps.name}-help` : undefined
          }
          aria-invalid={baseProps.error ? "true" : undefined}
          ref={ref}
        />
      </FormFieldWrapper>
    );
  }
);

TextareaField.displayName = "TextareaField";

// Select Field
interface SelectFieldProps extends BaseFormFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ value, onChange, options, placeholder, ...baseProps }, ref) => {
    const { getInputClasses } = useFormFieldStyles();

    return (
      <FormFieldWrapper {...baseProps}>
        <select
          id={baseProps.name}
          name={baseProps.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={baseProps.disabled}
          className={getInputClasses(baseProps.error)}
          aria-describedby={
            baseProps.helpText ? `${baseProps.name}-help` : undefined
          }
          aria-invalid={baseProps.error ? "true" : undefined}
          ref={ref}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </FormFieldWrapper>
    );
  }
);

SelectField.displayName = "SelectField";

// File Field
interface FileFieldProps extends BaseFormFieldProps {
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
}

export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  ({ onChange, accept, multiple, ...baseProps }, ref) => {
    const { getInputClasses } = useFormFieldStyles();

    return (
      <FormFieldWrapper {...baseProps}>
        <input
          id={baseProps.name}
          name={baseProps.name}
          type="file"
          onChange={(e) => onChange(e.target.files)}
          accept={accept}
          multiple={multiple}
          disabled={baseProps.disabled}
          className={getInputClasses(baseProps.error)}
          aria-describedby={
            baseProps.helpText ? `${baseProps.name}-help` : undefined
          }
          aria-invalid={baseProps.error ? "true" : undefined}
          ref={ref}
        />
      </FormFieldWrapper>
    );
  }
);

FileField.displayName = "FileField";

// Convenience exports for backward compatibility
export const FormField = TextField;

export const EmailField = forwardRef<
  HTMLInputElement,
  Omit<TextFieldProps, "type">
>((props, ref) => <TextField {...props} type="email" ref={ref} />);
EmailField.displayName = "EmailField";

export const PasswordField = forwardRef<
  HTMLInputElement,
  Omit<TextFieldProps, "type">
>((props, ref) => <TextField {...props} type="password" ref={ref} />);
PasswordField.displayName = "PasswordField";
