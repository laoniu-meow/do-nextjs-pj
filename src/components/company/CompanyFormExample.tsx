"use client";

import React, { useState } from "react";
import { Button, Box, Typography, Alert } from "@mui/material";
import { Add, Settings } from "@mui/icons-material";
import { SettingsPanel } from "../settings/SettingsPanel";
import {
  CompanyFormModal,
  CompanyFormInSettingsPanel,
  CompanyFormData,
} from "./index";

export const CompanyFormExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] =
    useState<CompanyFormData | null>(null);

  const handleSubmit = async (data: CompanyFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Company data submitted:", data);
      setLastSubmittedData(data);

      // In a real app, you would call your API here
      // const response = await fetch('/api/companies', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
    } catch (error) {
      console.error("Error submitting company:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="p-6 space-y-6">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
        Company Form Components Demo
      </Typography>

      {/* Usage Examples */}
      <Box className="space-y-4">
        <Typography variant="h6" className="font-semibold text-gray-700">
          Choose how you want to add a company:
        </Typography>

        <Box className="flex space-x-4">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              backgroundColor: "#3b82f6",
              "&:hover": { backgroundColor: "#2563eb" },
            }}
          >
            Open in Modal
          </Button>

          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setIsSettingsPanelOpen(true)}
            sx={{
              borderColor: "#6696f5",
              color: "#6696f5",
              "&:hover": {
                borderColor: "#4f7be0",
                backgroundColor: "#f0f4ff",
              },
            }}
          >
            Open in Settings Panel
          </Button>
        </Box>
      </Box>

      {/* Last Submitted Data Display */}
      {lastSubmittedData && (
        <Alert severity="success" className="mb-4">
          <Typography variant="body2" className="font-medium">
            Company &ldquo;{lastSubmittedData.name}&rdquo; was successfully
            submitted!
          </Typography>
          <Typography variant="caption" className="block mt-1">
            Email: {lastSubmittedData.email || "Not provided"} | Contact:{" "}
            {lastSubmittedData.contact || "Not provided"}
          </Typography>
        </Alert>
      )}

      {/* Modal Example */}
      <CompanyFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Add New Company"
        isLoading={isLoading}
      />

      {/* Settings Panel Example */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        onApply={() => {
          // This would typically save the form data
          console.log("Settings applied");
        }}
      >
        <CompanyFormInSettingsPanel
          onSubmit={handleSubmit}
          onCancel={() => setIsSettingsPanelOpen(false)}
          isLoading={isLoading}
        />
      </SettingsPanel>
    </Box>
  );
};
