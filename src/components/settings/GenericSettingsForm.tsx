"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Collapse,
  IconButton,
  Divider,
  Alert,
  Button,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  SettingsSchema,
  SettingField,
  SettingsData,
  MultiselectSettingField,
  BaseSettingField,
} from "@/types/settings";

interface GenericSettingsFormProps<T extends SettingsData = SettingsData> {
  schema: SettingsSchema;
  data: T;
  onFieldChange: (
    fieldId: string,
    value: string | number | boolean | string[] | File | File[] | null
  ) => void;
  // onSectionChange?: (sectionId: string, data: Partial<T>) => void;
  errors?: { [fieldId: string]: string };
  showSectionHeaders?: boolean;
  collapsibleSections?: boolean;
  onReset?: () => void;
}

export function GenericSettingsForm<T extends SettingsData = SettingsData>({
  schema,
  data,
  onFieldChange,
  // onSectionChange,
  errors = {},
  showSectionHeaders = true,
  collapsibleSections = true,
  onReset,
}: GenericSettingsFormProps<T>) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(schema.sections.map((s) => s.id))
  );

  const toggleSection = (sectionId: string) => {
    if (!collapsibleSections) return;

    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const renderField = (field: SettingField) => {
    const value = data[field.id];
    const error = errors[field.id];
    const isDirty = false; // This could be passed from parent if needed

    const commonProps = {
      fullWidth: true,
      size: "small" as const,
      error: !!error,
      helperText: error || field.helperText,
      placeholder: field.placeholder,
      required: field.required,
      disabled: false,
      sx: {
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: isDirty ? "#1976d2" : undefined,
          },
        },
      },
    };

    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <TextField
            {...commonProps}
            type={field.type}
            label={field.label}
            value={value || ""}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            multiline={field.type === "text" && field.multiline}
            rows={field.rows || 1}
          />
        );

      case "textarea":
        return (
          <TextField
            {...commonProps}
            label={field.label}
            value={value || ""}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            multiline
            rows={field.rows || 3}
            inputProps={{
              maxLength: field.maxLength,
            }}
          />
        );

      case "number":
        return (
          <TextField
            {...commonProps}
            type="number"
            label={field.label}
            value={value || ""}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            inputProps={{
              min: field.min,
              max: field.max,
              step: field.step || 1,
            }}
          />
        );

      case "select":
        return (
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={(value as string | number) || ""}
              label={field.label}
              onChange={(e: SelectChangeEvent<string | number>) =>
                onFieldChange(field.id, e.target.value)
              }
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case "switch":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => onFieldChange(field.id, e.target.checked)}
                color="primary"
              />
            }
            label={field.label}
            sx={{
              justifyContent: "space-between",
              margin: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
                color: "text.secondary",
              },
            }}
          />
        );

      case "color":
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {field.label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="color"
                value={(value as string) || "#000000"}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                style={{
                  width: "60px",
                  height: "40px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              />
              <TextField
                {...commonProps}
                label="Color Code"
                value={value || ""}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        );

      case "file":
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {field.label}
            </Typography>
            <input
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  onFieldChange(
                    field.id,
                    field.multiple
                      ? (Array.from(files) as File[])
                      : (files[0] as File)
                  );
                }
              }}
              style={{ display: "none" }}
              id={`file-${field.id}`}
            />
            <label htmlFor={`file-${field.id}`}>
              <Button
                variant="outlined"
                component="span"
                size="small"
                sx={{ textTransform: "none" }}
              >
                Choose File{field.multiple ? "s" : ""}
              </Button>
            </label>
            {value && (
              <Typography
                variant="caption"
                sx={{ ml: 2, color: "text.secondary" }}
              >
                {field.multiple
                  ? `${
                      Array.isArray(value) ? value.length : 1
                    } file(s) selected`
                  : typeof value === "string"
                  ? value
                  : value instanceof File
                  ? value.name
                  : "File selected"}
              </Typography>
            )}
          </Box>
        );

      case "multiselect": {
        const multiselectField = field as MultiselectSettingField;
        return (
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{multiselectField.label}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? (value as string[] | number[]) : []}
              label={multiselectField.label}
              onChange={(e: SelectChangeEvent<string[] | number[]>) => {
                const selectedValues = e.target.value;
                if (
                  multiselectField.maxSelections &&
                  selectedValues.length > multiselectField.maxSelections
                ) {
                  return; // Don't allow more selections than max
                }
                // Convert to string[] to match the expected type
                const convertedValues = Array.isArray(selectedValues)
                  ? selectedValues.map((val) => String(val))
                  : [String(selectedValues)];
                onFieldChange(multiselectField.id, convertedValues);
              }}
              input={<OutlinedInput label={multiselectField.label} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value: string | number) => {
                    const option = multiselectField.options?.find(
                      (opt: { value: string | number; label: string }) =>
                        opt.value === value
                    );
                    return (
                      <Chip
                        key={value}
                        label={option?.label || value}
                        size="small"
                        sx={{ maxWidth: "120px" }}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {multiselectField.options?.map(
                (option: { value: string | number; label: string }) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                )
              )}
            </Select>
            {error && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {error}
              </Typography>
            )}
          </FormControl>
        );
      }

      default: {
        // Type assertion to handle any remaining field types
        const defaultField = field as BaseSettingField;
        return (
          <TextField
            {...commonProps}
            label={defaultField.label}
            value={value || ""}
            onChange={(e) => onFieldChange(defaultField.id, e.target.value)}
          />
        );
      }
    }
  };

  return (
    <Box className="space-y-6">
      {/* Schema Description */}
      {schema.description && (
        <Box className="text-center pb-4">
          <Typography variant="body2" color="textSecondary">
            {schema.description}
          </Typography>
        </Box>
      )}

      {/* Reset Button */}
      {onReset && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={onReset}
            variant="outlined"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Reset to Defaults
          </Button>
        </Box>
      )}

      {/* Sections */}
      {schema.sections.map((section) => (
        <Box key={section.id} className="space-y-4">
          {/* Section Header */}
          {showSectionHeaders && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: collapsibleSections ? "pointer" : "default",
                "&:hover": collapsibleSections ? { opacity: 0.8 } : {},
              }}
              onClick={() => toggleSection(section.id)}
            >
              <Box>
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  {section.title}
                </Typography>
                {section.description && (
                  <Typography variant="body2" color="textSecondary">
                    {section.description}
                  </Typography>
                )}
              </Box>
              {collapsibleSections && (
                <IconButton size="small">
                  {expandedSections.has(section.id) ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              )}
            </Box>
          )}

          {/* Section Content */}
          <Collapse
            in={!collapsibleSections || expandedSections.has(section.id)}
          >
            <Box className="space-y-4">
              {section.fields.map((field) => (
                <Box key={field.id}>{renderField(field)}</Box>
              ))}
            </Box>
          </Collapse>

          {/* Section Divider */}
          {schema.sections.indexOf(section) < schema.sections.length - 1 && (
            <Divider />
          )}
        </Box>
      ))}

      {/* Global Errors */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Please fix the errors above before saving.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
