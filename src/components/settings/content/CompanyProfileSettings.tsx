"use client";

import React, { useState } from "react";
import { Typography, Alert, TextField, Box } from "@mui/material";
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
    <div className="space-y-3">
      {/* Form Validation Status */}
      {!isFormValid && (
        <Alert severity="warning" className="mb-3" sx={{ borderRadius: "8px" }}>
          <Typography variant="body2" className="text-sm">
            Please fill in all required fields before saving.
          </Typography>
        </Alert>
      )}

      {/* Company Form */}
      <Box component="form" className="space-y-4">
        <TextField
          fullWidth
          label="Company Name"
          value={formData.name}
          onChange={(e) =>
            handleFormChange(
              { ...formData, name: e.target.value },
              e.target.value.length > 0
            )
          }
          required
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Company Registration Number"
          value={formData.companyRegNumber}
          onChange={(e) =>
            handleFormChange(
              { ...formData, companyRegNumber: e.target.value },
              true
            )
          }
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            handleFormChange({ ...formData, email: e.target.value }, true)
          }
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Address"
          value={formData.address}
          onChange={(e) =>
            handleFormChange({ ...formData, address: e.target.value }, true)
          }
          variant="outlined"
          multiline
          rows={2}
        />
        <TextField
          fullWidth
          label="Country"
          value={formData.country}
          onChange={(e) =>
            handleFormChange({ ...formData, country: e.target.value }, true)
          }
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Postal Code"
          value={formData.postalCode}
          onChange={(e) =>
            handleFormChange({ ...formData, postalCode: e.target.value }, true)
          }
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Contact Person"
          value={formData.contact}
          onChange={(e) =>
            handleFormChange({ ...formData, contact: e.target.value }, true)
          }
          variant="outlined"
        />
      </Box>
    </div>
  );
};
