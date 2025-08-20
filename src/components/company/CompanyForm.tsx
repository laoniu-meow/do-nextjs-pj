import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import {
  CompanyFormProps,
  CreateCompanyData,
  UpdateCompanyData,
} from "../../types/company";

// Form field configuration to eliminate duplication
const formFields = [
  {
    name: "name" as keyof CreateCompanyData,
    label: "Company Name *",
    required: true,
    placeholder: "",
    helpText: "",
    multiline: false,
    rows: 1,
    type: "text",
  },
  {
    name: "website" as keyof CreateCompanyData,
    label: "Website",
    required: false,
    placeholder: "https://example.com",
    helpText: "Include http:// or https://",
    multiline: false,
    rows: 1,
    type: "text",
  },
  {
    name: "description" as keyof CreateCompanyData,
    label: "Description *",
    required: true,
    placeholder: "",
    helpText: "",
    multiline: true,
    rows: 3,
    type: "text",
    fullWidth: true, // This field spans full width
  },
  {
    name: "email" as keyof CreateCompanyData,
    label: "Email",
    required: false,
    placeholder: "contact@company.com",
    helpText: "",
    multiline: false,
    rows: 1,
    type: "email",
  },
  {
    name: "phone" as keyof CreateCompanyData,
    label: "Phone",
    required: false,
    placeholder: "+1 (555) 123-4567",
    helpText: "",
    multiline: false,
    rows: 1,
    type: "text",
  },
  {
    name: "address" as keyof CreateCompanyData,
    label: "Address",
    required: false,
    placeholder: "123 Business St, City, State, ZIP",
    helpText: "",
    multiline: true,
    rows: 2,
    type: "text",
    fullWidth: true, // This field spans full width
  },
];

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
  });
  const [errors, setErrors] = useState<Partial<CreateCompanyData>>({});

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
      });
    }
  }, [company]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCompanyData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Company description is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website =
        "Please enter a valid website URL (include http:// or https://)";
    }

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

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? "Edit Company" : "Create New Company"}
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
          {formFields.map((field) => (
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
                value={formData[field.name]}
                onChange={handleInputChange(field.name)}
                error={!!errors[field.name]}
                helperText={errors[field.name] || field.helpText}
                disabled={isLoading}
                required={field.required}
                placeholder={field.placeholder}
                multiline={field.multiline}
                rows={field.rows}
              />
            </Box>
          ))}
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
