import React from "react";
import { Box, Button, Alert } from "@mui/material";
import { Add, Save, CloudUpload, Refresh } from "@mui/icons-material";
import { CompanyProfileActionsProps } from "../types/companyProfile";

export const CompanyProfileActions: React.FC<CompanyProfileActionsProps> = ({
  hasUnsavedChanges = false,
  hasStagingData = false,
  isLoading = false,
  onBuild,
  onSave,
  onUpload,
  onRefresh,
}) => {
  // Safety check - ensure callbacks exist
  const handleBuild = () => onBuild?.();
  const handleSave = () => onSave?.();
  const handleUpload = () => onUpload?.();
  const handleRefresh = () => onRefresh?.();

  return (
    <Box sx={{ mb: 4, mt: 2 }}>
      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleBuild}
          disabled={isLoading}
          startIcon={<Add />}
          size="medium"
          sx={{
            backgroundColor: "#3b82f6",
            "&:hover": { backgroundColor: "#2563eb" },
            fontWeight: "bold",
            height: "36px", // Smaller height
            minHeight: "36px", // Ensure consistent height
            width: "120px", // Fixed width for consistency
            minWidth: "120px", // Ensure minimum width
          }}
        >
          Build
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isLoading || !hasUnsavedChanges}
          startIcon={<Save />}
          size="medium"
          sx={{
            backgroundColor: "#10b981",
            "&:hover": { backgroundColor: "#059669" },
            fontWeight: "bold",
            height: "36px", // Smaller height
            minHeight: "36px", // Ensure consistent height
            width: "120px", // Fixed width for consistency
            minWidth: "120px", // Ensure minimum width
          }}
        >
          Save
        </Button>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={isLoading || !hasStagingData}
          startIcon={<CloudUpload />}
          size="medium"
          sx={{
            backgroundColor: "#8b5cf6",
            "&:hover": { backgroundColor: "#7c3aed" },
            fontWeight: "bold",
            height: "36px", // Smaller height
            minHeight: "36px", // Ensure consistent height
            width: "120px", // Fixed width for consistency
            minWidth: "120px", // Ensure minimum width
          }}
        >
          Upload
        </Button>

        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={isLoading}
          startIcon={<Refresh />}
          size="medium"
          sx={{
            borderColor: "#6b7280",
            color: "#6b7280",
            "&:hover": {
              borderColor: "#374151",
              backgroundColor: "#f9fafb",
            },
            height: "36px", // Smaller height
            minHeight: "36px", // Ensure consistent height
            width: "120px", // Fixed width for consistency
            minWidth: "120px", // Ensure minimum width
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Status Indicators */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {hasUnsavedChanges && (
          <Alert
            severity="warning"
            sx={{
              borderRadius: "8px",
              "& .MuiAlert-message": { fontWeight: "500" },
            }}
          >
            You have unsaved changes. Click Save to preserve your work.
          </Alert>
        )}

        {hasStagingData && (
          <Alert
            severity="info"
            sx={{
              borderRadius: "8px",
              "& .MuiAlert-message": { fontWeight: "500" },
            }}
          >
            Data is saved in staging. Click Upload to move to production.
          </Alert>
        )}

        {!hasUnsavedChanges && !hasStagingData && (
          <Alert
            severity="success"
            sx={{
              borderRadius: "8px",
              "& .MuiAlert-message": { fontWeight: "500" },
            }}
          >
            All data is up to date and synchronized with production.
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default CompanyProfileActions;
