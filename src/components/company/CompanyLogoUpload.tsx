"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
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
    <Box
      className={cn("company-logo-upload", className)}
      sx={{
        width: "100%",
        "& .flex": { display: "flex !important" },
        "& .items-center": { alignItems: "center !important" },
      }}
    >
      <Typography
        variant="subtitle2"
        className="mb-2 font-medium text-gray-700"
        sx={{
          "&::after": required
            ? { content: '"*"', ml: 0.5, color: "#dc2626" }
            : {},
        }}
      >
        Company Logo
      </Typography>

      {previewUrl ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Avatar
            src={previewUrl}
            alt="Company Logo"
            sx={{
              width: 70,
              height: 70,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: "2px solid #f3f4f6",
            }}
            variant="rounded"
          />
          <Typography variant="body2" color="textSecondary" className="text-sm">
            Logo uploaded successfully
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            className="text-xs"
          >
            {currentLogo || "Logo file"}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Delete />}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveLogo();
            }}
            disabled={disabled || isUploading}
            sx={{
              fontSize: "0.75rem",
              padding: "4px 12px",
              minWidth: "auto",
            }}
          >
            Remove Logo
          </Button>
        </Box>
      ) : (
        <Box
          className="flex items-center space-x-6 w-full"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Box sx={{ flexShrink: 0 }}>
            {isUploading ? (
              <CircularProgress size={36} color="primary" />
            ) : (
              <CloudUpload sx={{ fontSize: 36, color: "#9ca3af" }} />
            )}
          </Box>
          <Box
            className={cn(
              "border-2 border-dashed rounded-lg p-3 transition-all duration-200",
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300",
              error || uploadError ? "border-red-300 bg-red-50" : "",
              disabled || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            )}
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                borderColor: "#3b82f6",
              },
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={!disabled && !isUploading ? handleUploadClick : undefined}
          >
            <Box
              className="flex flex-col space-y-1"
              style={{ textAlign: "left" }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                className="text-sm"
                style={{ textAlign: "left" }}
              >
                {isUploading ? (
                  <span className="text-blue-600 font-medium">
                    Uploading...
                  </span>
                ) : (
                  <>
                    <span className="text-blue-600 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </>
                )}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                className="text-xs"
                style={{ textAlign: "left" }}
              >
                PNG, JPG, GIF, SVG up to 5MB
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {(error || uploadError) && (
        <Typography variant="caption" color="error" className="mt-1 block">
          {error || uploadError}
        </Typography>
      )}
    </Box>
  );
};
