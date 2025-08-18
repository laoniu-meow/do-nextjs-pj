"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { cn } from "@/lib/utils";

import { CompanyFormField } from "./CompanyFormField";
import { CompanyLogoUpload } from "./CompanyLogoUpload";
import { CompanyFormSection } from "./CompanyFormSection";
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
  }, [formData, onFormChange, validateForm]); // Include all dependencies

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
        // File uploaded successfully, store both filename and URL
        setFormData((prev) => ({
          ...prev,
          logo: file.name,
          logoUrl: logoUrl,
        }));
      } else {
        // Logo removed
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

  return (
    <Box className={cn("", className)}>
      {/* 1. Company Logo */}
      <CompanyFormSection showDivider={false}>
        <CompanyLogoUpload
          currentLogo={formData.logoUrl}
          onLogoChange={handleLogoChange}
          error={errors.logo}
        />
      </CompanyFormSection>

      {/* MASSIVE SPACING AFTER LOGO */}
      <Box sx={{ marginBottom: "20px" }} />

      {/* 2. Company Name */}
      <CompanyFormSection required showDivider={false}>
        <CompanyFormField
          label=""
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          required
          placeholder="Enter company name"
        />
      </CompanyFormSection>

      {/* 3. Company Registration Number */}
      <CompanyFormSection showDivider={false}>
        <CompanyFormField
          label="Company Registration Number"
          name="companyRegNumber"
          value={formData.companyRegNumber || ""}
          onChange={(e) =>
            handleInputChange("companyRegNumber", e.target.value)
          }
          placeholder="Enter company registration number"
        />
      </CompanyFormSection>

      {/* 4. Address */}
      <CompanyFormSection showDivider={false}>
        <CompanyFormField
          label="Address"
          name="address"
          value={formData.address || ""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          multiline
          rows={2}
          placeholder="Enter company address"
          sx={{
            "& .MuiInputBase-root": {
              padding: "0px 0px",
              alignItems: "flex-start",
              alignContent: "flex-start",
              height: "55px",
            },
          }}
        />
      </CompanyFormSection>

      {/* 5. Country */}
      <CompanyFormSection showDivider={false}>
        <CompanyFormField
          label="Country"
          name="country"
          value={formData.country || ""}
          onChange={(e) => handleInputChange("country", e.target.value)}
          placeholder="Enter country"
        />
      </CompanyFormSection>

      {/* 6. Postal Code */}
      <CompanyFormSection showDivider={false}>
        <CompanyFormField
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode || ""}
          onChange={(e) => handleInputChange("postalCode", e.target.value)}
          placeholder="Enter postal code"
        />
      </CompanyFormSection>

      {/* 7. Email */}
      <CompanyFormSection showDivider={false}>
        <CompanyFormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          placeholder="contact@company.com"
        />
      </CompanyFormSection>

      {/* 8. Contact */}
      <CompanyFormSection showDivider={false}>
        <CompanyFormField
          label="Contact"
          name="contact"
          value={formData.contact || ""}
          onChange={(e) => handleInputChange("contact", e.target.value)}
          placeholder="Enter contact number"
        />
      </CompanyFormSection>

      {/* Submit and Cancel Buttons */}
      {(onSubmit || onCancel) && (
        <Box className="flex justify-end space-x-3 mt-6">
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
              sx={{
                borderColor: "#6b7280",
                color: "#6b7280",
                "&:hover": {
                  borderColor: "#4b5563",
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              Cancel
            </Button>
          )}
          {onSubmit && (
            <Button
              variant="contained"
              onClick={() => onSubmit(formData)}
              disabled={isLoading || !validateForm()}
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
                "&:disabled": { backgroundColor: "#9ca3af" },
              }}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};
