import React from "react";
import { Typography, Button, Paper } from "@mui/material";
import { Business, Add } from "@mui/icons-material";
import { CompanyProfileEmptyStateProps } from "../types/companyProfile";

export const CompanyProfileEmptyState: React.FC<
  CompanyProfileEmptyStateProps
> = ({ onBuild }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        textAlign: "center",
        padding: "48px 24px",
        backgroundColor: "#fafafa",
        border: "2px dashed #d1d5db",
        borderRadius: "12px",
      }}
    >
      <Business
        sx={{
          fontSize: 80,
          color: "#9ca3af",
          marginBottom: "16px",
        }}
      />

      <Typography
        variant="h5"
        component="h3"
        sx={{
          color: "#374151",
          fontWeight: "600",
          marginBottom: "12px",
        }}
      >
        No companies yet
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#6b7280",
          marginBottom: "24px",
          maxWidth: "400px",
          margin: "0 auto 24px",
          lineHeight: 1.6,
        }}
      >
        Get started by creating your first company profile. You can add company
        information, logos, and contact details.
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onBuild}
        size="large"
        sx={{
          backgroundColor: "#3b82f6",
          "&:hover": { backgroundColor: "#2563eb" },
          fontWeight: "bold",
          padding: "12px 24px",
          fontSize: "16px",
        }}
      >
        Create Your First Company
      </Button>

      <Typography
        variant="caption"
        sx={{
          color: "#9ca3af",
          display: "block",
          marginTop: "16px",
          fontStyle: "italic",
        }}
      >
        This will be your main company profile
      </Typography>
    </Paper>
  );
};

export default CompanyProfileEmptyState;
