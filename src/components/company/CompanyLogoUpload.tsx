"use client";

import React, { useState, useRef } from "react";
import { Button, Box, Typography, Avatar } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { cn } from "@/lib/utils";

interface CompanyLogoUploadProps {
  currentLogo?: string;
  onLogoChange: (file: File | null) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        // Pass the file object to parent, which can extract the filename
        onLogoChange(file);
      };
      reader.readAsDataURL(file);
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
            disabled={disabled}
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
            <CloudUpload sx={{ fontSize: 36, color: "#9ca3af" }} />
          </Box>
          <Box
            className={cn(
              "border-2 border-dashed rounded-lg p-3 transition-all duration-200",
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300",
              error ? "border-red-300 bg-red-50" : "",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
            onClick={!disabled ? handleUploadClick : undefined}
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
                <span className="text-blue-600 font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
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
        disabled={disabled}
      />

      {error && (
        <Typography variant="caption" color="error" className="mt-1 block">
          {error}
        </Typography>
      )}
    </Box>
  );
};
