"use client";

import {
  PageLayout,
  MainContentBox,
  RoundIconButton,
  PillButton,
  CompanyProfileCard,
} from "@/components/ui";
import { Box, Alert, Snackbar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import LoopIcon from "@mui/icons-material/Loop";
import AddIcon from "@mui/icons-material/Add";
import {
  useCompanyProfile,
  CompanyProfileData,
} from "@/hooks/useCompanyProfile";
import { useState } from "react";

export default function CompanyProfilePage() {
  const {
    profiles,
    isLoading,
    saveButtonEnabled,
    uploadButtonEnabled,
    loadProfiles,
    saveToStaging,
    uploadToProduction,
    updateProfile,
    addProfile,
    removeProfile,
  } = useCompanyProfile();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = async () => {
    try {
      const success = await saveToStaging();
      if (success) {
        setSnackbar({
          open: true,
          message: "Company profiles saved to staging successfully!",
          severity: "success",
        });
        setEditingIndex(null); // Exit edit mode
      } else {
        setSnackbar({
          open: true,
          message: "Failed to save company profiles to staging",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Error saving company profiles",
        severity: "error",
      });
    }
  };

  const handleUpload = async () => {
    try {
      const success = await uploadToProduction();
      if (success) {
        setSnackbar({
          open: true,
          message: "Company profiles uploaded to production successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to upload company profiles to production",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Error uploading company profiles",
        severity: "error",
      });
    }
  };

  const handleRefresh = () => {
    loadProfiles();
    setEditingIndex(null);
  };

  const handleAddCompany = (type: "MAIN" | "BRANCH") => {
    addProfile(type);
    // Set the new profile to editing mode
    setEditingIndex(profiles.length);
  };

  const handleRemoveCompany = (index: number) => {
    removeProfile(index);
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleUpdateProfile = (
    index: number,
    data: Partial<CompanyProfileData>
  ) => {
    updateProfile(index, data);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <PageLayout
      title="Company Profile"
      description="Manage your company information, contact details, branding, and business settings. This information will be displayed on your website and used for business communications."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Company Profile" },
      ]}
      maxWidth="xl"
    >
      <MainContentBox variant="default">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            mb: "2rem",
            gap: { xs: 2, sm: 0 },
          }}
        >
          {/* Company Information Title - First on mobile */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 0 },
              order: { xs: 1, sm: 1 },
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1f2937",
                margin: 0,
              }}
            >
              Company Information
            </h2>
          </Box>

          {/* Action Buttons - Second on mobile, positioned to the right on larger screens */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 4, sm: 2 },
              justifyContent: { xs: "center", sm: "flex-end" },
              flexWrap: "wrap",
              order: { xs: 2, sm: 2 },
            }}
          >
            <RoundIconButton
              icon={<SettingsIcon />}
              variant="primary"
              size="medium"
              tooltip="Settings"
              sx={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            />
            <RoundIconButton
              icon={<SaveAltIcon />}
              variant="success"
              size="medium"
              tooltip="Save"
              disabled={!saveButtonEnabled}
              onClick={handleSave}
              sx={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: saveButtonEnabled ? "#4ade80" : "#9ca3af",
                "&:hover": {
                  backgroundColor: saveButtonEnabled ? "#22c55e" : "#9ca3af",
                },
              }}
            />
            <RoundIconButton
              icon={<CloudSyncIcon />}
              variant="success"
              size="medium"
              tooltip="Upload"
              disabled={!uploadButtonEnabled}
              onClick={handleUpload}
              sx={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: uploadButtonEnabled ? "#ec4899" : "#9ca3af", // Light pink when enabled
                "&:hover": {
                  backgroundColor: uploadButtonEnabled ? "#db2777" : "#9ca3af", // Darker pink on hover
                },
              }}
            />
            <RoundIconButton
              icon={<LoopIcon />}
              variant="primary"
              size="medium"
              tooltip="Refresh"
              onClick={handleRefresh}
              sx={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            />
          </Box>
        </Box>

        {/* Add Company Buttons - Third on mobile, with narrower height */}
        <Box
          sx={{
            mb: 0.5,
            order: { xs: 3, sm: 3 },
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <PillButton
            label="Add Main Company"
            icon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={() => handleAddCompany("MAIN")}
            disabled={profiles.some((p) => p.type === "MAIN")}
          />
          <PillButton
            label="Add Branch"
            icon={<AddIcon />}
            variant="contained"
            color="secondary"
            onClick={() => handleAddCompany("BRANCH")}
          />
        </Box>

        {/* Company Profile Cards Grid */}
        <Box sx={{ mt: 3 }}>
          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <LoopIcon
                sx={{ fontSize: "2rem", animation: "spin 1s linear infinite" }}
              />
              <Box sx={{ mt: 1 }}>Loading company profiles...</Box>
            </Box>
          ) : profiles.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "grey.500" }}>
              No company profiles found. Add your first company profile above.
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr", // Mobile: 1 column (stacked)
                  sm: "1fr", // Small tablet: 1 column (stacked)
                  md: "repeat(2, 1fr)", // Medium tablet: 2 columns
                  lg: "repeat(2, 1fr)", // Large tablet: 2 columns
                  xl: "repeat(2, 1fr)", // Desktop: 2 columns
                },
                gap: {
                  xs: 2, // Mobile: smaller gap
                  sm: 2, // Small tablet: smaller gap
                  md: 3, // Medium and up: larger gap
                },
                alignItems: "start",
              }}
            >
              {profiles.map((profile, index) => (
                <CompanyProfileCard
                  key={profile.id || index}
                  type={profile.type}
                  profile={profile}
                  index={index}
                  isEditing={editingIndex === index}
                  onEdit={handleEdit}
                  onUpdate={handleUpdateProfile}
                  onRemove={
                    profile.type === "BRANCH" ? handleRemoveCompany : undefined
                  }
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </MainContentBox>
    </PageLayout>
  );
}
