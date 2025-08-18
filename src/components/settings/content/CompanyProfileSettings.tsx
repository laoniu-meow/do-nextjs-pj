"use client";

import React, { useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { CompanyCreateForm } from "@/components/company";
import { CompanyFormData } from "@/types";

interface CompanyProfileSettingsProps {
  onFormDataChange?: (data: CompanyFormData) => void;
  initialData?: CompanyFormData;
}

export const CompanyProfileSettings: React.FC<CompanyProfileSettingsProps> = ({
  onFormDataChange,
  initialData,
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    companyRegNumber: "",
    email: "",
    address: "",
    country: "",
    postalCode: "",
    contact: "",
    ...initialData,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleFormChange = (data: CompanyFormData, isValid: boolean) => {
    console.log(
      "CompanyProfileSettings - Form data changed:",
      data,
      "Valid:",
      isValid
    );
    setFormData(data);
    setIsFormValid(isValid);

    // Pass form data to parent component
    if (onFormDataChange) {
      console.log(
        "CompanyProfileSettings - Calling onFormDataChange with:",
        data
      );
      onFormDataChange(data);
    } else {
      console.log("CompanyProfileSettings - onFormDataChange is not defined");
    }
  };

  return (
    <Box className="space-y-3">
      {/* Form Validation Status */}
      {!isFormValid && (
        <Alert severity="warning" className="mb-3" sx={{ borderRadius: "8px" }}>
          <Typography variant="body2" className="text-sm">
            Please fill in all required fields before saving.
          </Typography>
        </Alert>
      )}

      {/* Company Form */}
      <CompanyCreateForm
        initialData={formData}
        onFormChange={handleFormChange}
      />
    </Box>
  );
};
