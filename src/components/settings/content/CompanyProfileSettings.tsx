"use client";

import React, { useState } from "react";
import {
  Typography,
  Alert,
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { CompanyFormData } from "@/types";
import { logger } from "@/lib/logger";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleFormChange = (data: CompanyFormData, isValid: boolean) => {
    setFormData(data);
    setIsFormValid(isValid);

    // Pass form data to parent component
    if (onFormDataChange) {
      onFormDataChange(data);
    }
  };

  const handleLogoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload/logo", {
        method: "POST",
        body,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const json = await res.json();
      const uploadedPath: string | undefined = json?.data?.filePath;
      if (!uploadedPath) {
        throw new Error("Upload succeeded but no file path returned");
      }

      const updated: CompanyFormData = { ...formData, logoUrl: uploadedPath };
      handleFormChange(updated, isFormValid);
    } catch (err) {
      logger.error("Logo upload failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      // Reset input value to allow re-selecting the same file if needed
      e.currentTarget.value = "";
    }
  };

  const handleRemoveLogo = () => {
    const updated: CompanyFormData = { ...formData };
    delete updated.logoUrl;
    delete updated.logo;
    handleFormChange(updated, isFormValid);
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
        {/* Logo Uploader */}
        <Box sx={{ mt: 1, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "#4b5563" }}>
            Company Logo
          </Typography>

          {uploadError && (
            <Alert severity="error" sx={{ mb: 1, borderRadius: "8px" }}>
              <Typography variant="body2">{uploadError}</Typography>
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              rowGap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Preview */}
            {formData.logoUrl ? (
              <Image
                src={formData.logoUrl}
                alt="Company logo preview"
                width={64}
                height={64}
                style={{
                  borderRadius: 8,
                  objectFit: "contain",
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 1,
                  bgcolor: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                }}
              />
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Button
                variant="contained"
                component="label"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <CircularProgress
                      size={18}
                      sx={{ mr: 1, color: "white" }}
                    />
                    Uploading...
                  </>
                ) : (
                  "Upload Logo"
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoFileChange}
                />
              </Button>
              {formData.logoUrl && (
                <Button variant="text" color="error" onClick={handleRemoveLogo}>
                  Remove
                </Button>
              )}
            </div>
          </Box>
        </Box>

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
