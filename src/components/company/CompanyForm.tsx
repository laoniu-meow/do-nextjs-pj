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
          <Box>
            <TextField
              fullWidth
              label="Company Name *"
              value={formData.name}
              onChange={handleInputChange("name")}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isLoading}
              required
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Website"
              value={formData.website}
              onChange={handleInputChange("website")}
              error={!!errors.website}
              helperText={errors.website || "Include http:// or https://"}
              disabled={isLoading}
              placeholder="https://example.com"
            />
          </Box>

          <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
            <TextField
              fullWidth
              label="Description *"
              value={formData.description}
              onChange={handleInputChange("description")}
              error={!!errors.description}
              helperText={errors.description}
              disabled={isLoading}
              multiline
              rows={3}
              required
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              placeholder="contact@company.com"
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              disabled={isLoading}
              placeholder="+1 (555) 123-4567"
            />
          </Box>

          <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleInputChange("address")}
              disabled={isLoading}
              multiline
              rows={2}
              placeholder="123 Business St, City, State, ZIP"
            />
          </Box>
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
