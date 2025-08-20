import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import {
  CompanyFormProps,
  CreateCompanyData,
  UpdateCompanyData,
} from "../../types/company";
import { useCompanyFieldConfig } from "../../hooks/useCompanyFieldConfig";

export const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateCompanyData>({
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    companyRegNumber: "",
    country: "",
    postalCode: "",
    contact: "",
  });
  const [errors, setErrors] = useState<Partial<CreateCompanyData>>({});

  // Fetch dynamic field configuration from database
  const {
    fieldConfigs,
    isLoading: isConfigLoading,
    error: configError,
    source,
  } = useCompanyFieldConfig();

  const isEditing = !!company;

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description,
        website: company.website || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        companyRegNumber: company.companyRegNumber || "",
        country: company.country || "",
        postalCode: company.postalCode || "",
        contact: company.contact || "",
      });
    }
  }, [company]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCompanyData> = {};

    // Dynamic validation based on field configuration
    fieldConfigs.forEach((field) => {
      const fieldName = field.name as keyof CreateCompanyData;
      const fieldValue = formData[fieldName];

      // Required field validation
      if (field.required && (!fieldValue || fieldValue.trim() === "")) {
        newErrors[fieldName] = `${field.label.replace(" *", "")} is required`;
        return;
      }

      // Pattern validation
      if (field.validation?.pattern && fieldValue) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(fieldValue)) {
          newErrors[fieldName] = `Invalid ${field.label.toLowerCase()} format`;
          return;
        }
      }

      // Length validation
      if (
        field.validation?.minLength &&
        fieldValue &&
        fieldValue.length < field.validation.minLength
      ) {
        newErrors[
          fieldName
        ] = `${field.label} must be at least ${field.validation.minLength} characters`;
        return;
      }

      if (
        field.validation?.maxLength &&
        fieldValue &&
        fieldValue.length > field.validation.maxLength
      ) {
        newErrors[
          fieldName
        ] = `${field.label} must be no more than ${field.validation.maxLength} characters`;
        return;
      }

      // Email validation
      if (
        field.type === "email" &&
        fieldValue &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)
      ) {
        newErrors[fieldName] = "Please enter a valid email address";
        return;
      }

      // Website validation
      if (
        field.type === "url" &&
        fieldValue &&
        !/^https?:\/\/.+/.test(fieldValue)
      ) {
        newErrors[fieldName] =
          "Please enter a valid website URL (include http:// or https://)";
        return;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditing && company) {
      const updateData: UpdateCompanyData = {
        id: company.id,
        ...formData,
      };
      onSubmit(updateData);
    } else {
      onSubmit(formData);
    }
  };

  const handleInputChange =
    (field: keyof CreateCompanyData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  // Show loading state while fetching field configuration
  if (isConfigLoading) {
    return (
      <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading form configuration...
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Show error state if field configuration fails to load
  if (configError) {
    return (
      <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Warning: Using default form configuration. {configError}
          </Typography>
        </Alert>
        <Typography variant="h5" component="h2" gutterBottom>
          {isEditing ? "Edit Company" : "Create New Company"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configuration source: {source}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? "Edit Company" : "Create New Company"}
      </Typography>

      {/* Show configuration source */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Form configuration loaded from: <strong>{source}</strong>
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          {fieldConfigs.map((field) => {
            const fieldName = field.name as keyof CreateCompanyData;
            return (
              <Box
                key={field.name}
                sx={
                  field.fullWidth
                    ? { gridColumn: { xs: "1", sm: "1 / -1" } }
                    : {}
                }
              >
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  value={formData[fieldName] || ""}
                  onChange={handleInputChange(fieldName)}
                  error={!!errors[fieldName]}
                  helperText={errors[fieldName] || field.helpText}
                  disabled={isLoading}
                  required={field.required}
                  placeholder={field.placeholder}
                  multiline={field.multiline}
                  rows={field.rows}
                  inputProps={{
                    minLength: field.validation?.minLength,
                    maxLength: field.validation?.maxLength,
                    pattern: field.validation?.pattern,
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
          >
            {isLoading
              ? "Saving..."
              : isEditing
              ? "Update Company"
              : "Create Company"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CompanyForm;
