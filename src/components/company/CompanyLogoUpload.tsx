"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import { CloudUpload, Delete, PhotoCamera } from "@mui/icons-material";
import { cn } from "@/lib/utils";

interface CompanyLogoUploadProps {
  currentLogo?: string;
  onLogoChange: (file: File | null, logoUrl?: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const CompanyLogoUpload: React.FC<CompanyLogoUploadProps> = ({
  currentLogo,
  onLogoChange,
  className,
  disabled = false,
  required = false,
  error,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentLogo || null
  );
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update previewUrl when currentLogo changes (for editing existing profiles)
  useEffect(() => {
    setPreviewUrl(currentLogo || null);
  }, [currentLogo]);

  const uploadLogoToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/logo", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload logo");
    }

    const result = await response.json();
    return result.data.filePath;
  };

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      try {
        setIsUploading(true);
        setUploadError(null);

        // Upload to server first
        const logoUrl = await uploadLogoToServer(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreviewUrl(result);
        };
        reader.readAsDataURL(file);

        // Pass both file and logo URL to parent
        onLogoChange(file, logoUrl);
      } catch (error) {
        console.error("Error uploading logo:", error);
        setUploadError(
          error instanceof Error ? error.message : "Upload failed"
        );
        setPreviewUrl(null);
        onLogoChange(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    setUploadError(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box className={cn("company-logo-upload", className)}>
      {previewUrl ? (
        // Logo Preview State
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            border: "2px solid #0ea5e9",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Logo Preview */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={previewUrl}
                alt="Company Logo"
                sx={{
                  width: 80,
                  height: 80,
                  boxShadow: "0 8px 25px rgba(14, 165, 233, 0.25)",
                  border: "3px solid #ffffff",
                }}
                variant="rounded"
              />
              <Chip
                label="✓ Uploaded"
                size="small"
                color="success"
                sx={{
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* File Info */}
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#0c4a6e", fontWeight: 600 }}
              >
                Logo uploaded successfully
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#0369a1", fontSize: "0.75rem" }}
              >
                {currentLogo || "Logo file"}
              </Typography>
            </Box>

            {/* Remove Button */}
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Delete />}
              onClick={handleRemoveLogo}
              disabled={disabled || isUploading}
              sx={{
                borderRadius: "8px",
                borderColor: "#ef4444",
                color: "#ef4444",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#dc2626",
                  backgroundColor: "#fef2f2",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Remove Logo
            </Button>
          </Box>
        </Paper>
      ) : (
        // Upload State
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            background: dragActive
              ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            border: "2px dashed",
            borderColor: dragActive ? "#3b82f6" : error ? "#ef4444" : "#cbd5e1",
            transition: "all 0.2s ease",
            cursor: disabled || isUploading ? "not-allowed" : "pointer",
            opacity: disabled || isUploading ? 0.6 : 1,
            "&:hover": {
              borderColor: "#3b82f6",
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!disabled && !isUploading ? handleUploadClick : undefined}
        >
          <Box sx={{ textAlign: "center" }}>
            {/* Upload Icon */}
            <Box sx={{ mb: 2 }}>
              {isUploading ? (
                <CircularProgress size={48} sx={{ color: "#3b82f6" }} />
              ) : (
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  {dragActive ? (
                    <PhotoCamera sx={{ fontSize: 32, color: "white" }} />
                  ) : (
                    <CloudUpload sx={{ fontSize: 32, color: "white" }} />
                  )}
                </Box>
              )}
            </Box>

            {/* Upload Text */}
            <Typography
              variant="h6"
              sx={{
                color: dragActive ? "#1e40af" : "#1e293b",
                fontWeight: 600,
                mb: 1,
              }}
            >
              {isUploading
                ? "Uploading..."
                : dragActive
                ? "Drop your logo here"
                : "Upload Company Logo"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 2,
                lineHeight: 1.5,
              }}
            >
              {isUploading
                ? "Please wait while we upload your logo..."
                : "Click to browse or drag and drop your company logo"}
            </Typography>

            {/* File Requirements */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label="PNG, JPG, GIF, SVG"
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem", borderColor: "#cbd5e1" }}
              />
              <Chip
                label="Max 5MB"
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem", borderColor: "#cbd5e1" }}
              />
              {required && (
                <Chip
                  label="Required"
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Error Display */}
      {(error || uploadError) && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#dc2626",
              fontSize: "0.75rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ⚠️ {error || uploadError}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
