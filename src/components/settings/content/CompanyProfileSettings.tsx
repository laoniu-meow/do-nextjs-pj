"use client";

import React, { useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { CompanyCreateForm } from "@/components/company";
import { CompanyFormData } from "@/types";

export const CompanyProfileSettings: React.FC = () => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "Your Company Name",
    companyRegNumber: "REG123456",
    email: "contact@company.com",
    address: "123 Business St, City, State 12345",
    country: "United States",
    postalCode: "12345",
    contact: "+1 (555) 123-4567",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormChange = (data: CompanyFormData, isValid: boolean) => {
    setFormData(data);
    setIsFormValid(isValid);
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
