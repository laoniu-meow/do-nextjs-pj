import React from "react";
import { CircularProgress, Paper } from "@mui/material";
import { Typography } from "@/components/ui";

export const CompanyProfileLoading: React.FC = () => {
  return (
    <Paper
      elevation={1}
      sx={{
        textAlign: "center",
        padding: "48px 24px",
        backgroundColor: "#fafafa",
        borderRadius: "12px",
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: "#3b82f6",
          marginBottom: "16px",
        }}
      />

      <Typography
        variant="h6"
        sx={{
          color: "#374151",
          fontWeight: "500",
          marginBottom: "8px",
        }}
      >
        Loading Company Profiles
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#6b7280",
        }}
      >
        Please wait while we fetch your company information...
      </Typography>
    </Paper>
  );
};

export default CompanyProfileLoading;
