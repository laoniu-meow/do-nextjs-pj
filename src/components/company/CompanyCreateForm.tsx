"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button, Paper, Typography, Chip, Alert } from "@mui/material";

import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  ContactMail as ContactIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { cn } from "@/lib/utils";

import { CompanyFormField } from "./CompanyFormField";
import { CompanyLogoUpload } from "./CompanyLogoUpload";
import { CompanyFormData } from "@/types";

interface CompanyCreateFormProps {
  initialData?: Partial<CompanyFormData>;
  className?: string;
  onFormChange?: (data: CompanyFormData, isValid: boolean) => void;
  onSubmit?: (data: CompanyFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CompanyCreateForm: React.FC<CompanyCreateFormProps> = ({
  initialData = {},
  className,
  onFormChange,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    logo: "",
    companyRegNumber: "",
    address: "",
    country: "",
    postalCode: "",
    email: "",
    contact: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CompanyFormData, string>>
  >({});

  const validateForm = useCallback(
    (data: CompanyFormData = formData): boolean => {
      const newErrors: Partial<Record<keyof CompanyFormData, string>> = {};

      if (!data.name.trim()) {
        newErrors.name = "Company name is required";
      }

      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = "Invalid email format";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  // Notify parent of initial form data and validation
  useEffect(() => {
    if (onFormChange) {
      const isValid = validateForm(formData);
      onFormChange(formData, isValid);
    }
  }, [formData, onFormChange, validateForm]);

  const handleInputChange = useCallback(
    (field: keyof CompanyFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
      // Notify parent of form changes
      if (onFormChange) {
        const newFormData = { ...formData, [field]: value };
        const isValid = validateForm(newFormData);
        onFormChange(newFormData, isValid);
      }
    },
    [errors, formData, onFormChange, validateForm]
  );

  const handleLogoChange = useCallback(
    (file: File | null, logoUrl?: string) => {
      if (file && logoUrl) {
        setFormData((prev) => ({
          ...prev,
          logo: file.name,
          logoUrl: logoUrl,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          logo: "",
          logoUrl: "",
        }));
      }
      // Notify parent of form changes
      if (onFormChange) {
        const newFormData = {
          ...formData,
          logo: file ? file.name : "",
          logoUrl: logoUrl || "",
        };
        const isValid = validateForm(newFormData);
        onFormChange(newFormData, isValid);
      }
    },
    [formData, onFormChange, validateForm]
  );

  const isFormValid = useMemo(() => validateForm(), [validateForm]);

  return (
    <Box className={cn("company-create-form", className)}>
      {/* Form Validation Status */}
      {!isFormValid && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: "12px",
            "& .MuiAlert-message": { fontSize: "0.875rem" },
          }}
        >
          Please fill in all required fields before saving.
        </Alert>
      )}

      {/* Company Logo Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          border: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <UploadIcon sx={{ color: "#3b82f6", mr: 1, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Company Branding
          </Typography>
        </Box>
        <CompanyLogoUpload
          currentLogo={formData.logoUrl}
          onLogoChange={handleLogoChange}
          error={errors.logo}
        />
      </Paper>

      {/* Basic Information Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          border: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <BusinessIcon sx={{ color: "#10b981", mr: 1, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Basic Information
          </Typography>
          <Chip
            label="Required"
            size="small"
            color="error"
            variant="outlined"
            sx={{ ml: 2, fontSize: "0.75rem" }}
          />
        </Box>

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
            <CompanyFormField
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
              placeholder="Enter your company name"
            />
          </Box>

          <Box>
            <CompanyFormField
              label="Company Registration Number"
              name="companyRegNumber"
              value={formData.companyRegNumber || ""}
              onChange={(e) =>
                handleInputChange("companyRegNumber", e.target.value)
              }
              placeholder="Enter registration number"
              helpText="Official business registration identifier"
            />
          </Box>

          <Box>
            <CompanyFormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="contact@company.com"
              helpText="Primary business email address"
            />
          </Box>
        </Box>
      </Paper>

      {/* Location Information Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          border: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <LocationIcon sx={{ color: "#f59e0b", mr: 1, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Location & Address
          </Typography>
        </Box>

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
            <CompanyFormField
              label="Company Address"
              name="address"
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              multiline
              rows={3}
              placeholder="Enter complete company address"
              helpText="Full street address including city and state"
            />
          </Box>

          <Box>
            <CompanyFormField
              label="Country"
              name="country"
              value={formData.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="Select or enter country"
              helpText="Country where company is registered"
            />
          </Box>

          <Box>
            <CompanyFormField
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode || ""}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              placeholder="Enter postal/zip code"
              helpText="Postal code for the address"
            />
          </Box>
        </Box>
      </Paper>

      {/* Contact Information Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          border: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <ContactIcon sx={{ color: "#8b5cf6", mr: 1, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Contact Details
          </Typography>
        </Box>

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
            <CompanyFormField
              label="Contact Person"
              name="contact"
              value={formData.contact || ""}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              placeholder="Enter contact person name"
              helpText="Primary contact person for inquiries"
            />
          </Box>

          <Box>
            <CompanyFormField
              label="Phone Number"
              name="phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              helpText="Business phone number"
            />
          </Box>
        </Box>
      </Paper>

      {/* Action Buttons */}
      {(onSubmit || onCancel) && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                borderColor: "#6b7280",
                color: "#6b7280",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.875rem",
                "&:hover": {
                  borderColor: "#4b5563",
                  backgroundColor: "#f3f4f6",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Cancel
            </Button>
          )}
          {onSubmit && (
            <Button
              variant="contained"
              onClick={() => onSubmit(formData)}
              disabled={isLoading || !isFormValid}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.875rem",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
                },
                "&:disabled": {
                  background: "#9ca3af",
                  transform: "none",
                  boxShadow: "none",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isLoading ? "Saving..." : "Save Company Profile"}
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};
