import React, { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { GenericSettingsPanel } from "@/components/settings";
import {
  COMPANY_PROFILE_SETTINGS_SCHEMA,
  SettingsData,
} from "@/types/settings";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { CompanyProfileGrid } from "./CompanyProfileGrid";
import { CompanyProfileEmptyState } from "./CompanyProfileEmptyState";
import { CompanyProfileLoading } from "./CompanyProfileLoading";
import { CompanyFormData } from "@/types";

export const CompanyProfilePage: React.FC = () => {
  const {
    companies,
    isLoading,
    error,
    hasUnsavedChanges,
    isEditMode,
    isSettingsOpen,
    currentCompany,
    handleBuild,
    handleEditCompany,
    handleRemoveCompany,
    handleSave,
    handleUpload,
    handleRefresh,
    handleCloseSettings,
    handleApplySettings,
    clearError,
  } = useCompanyProfile();

  // Store form data when it changes
  const [currentFormData, setCurrentFormData] =
    useState<CompanyFormData | null>(null);

  // Ensure companies is always an array
  const safeCompanies = Array.isArray(companies) ? companies : [];

  // Handle form data changes
  const handleFormDataChange = (formData: CompanyFormData) => {
    setCurrentFormData(formData);
  };

  // Handle apply settings with current form data
  const handleApplySettingsWithData = () => {
    if (currentFormData) {
      handleApplySettings(currentFormData);
    } else {
      // no-op when no form data
    }
  };

  return (
    <PageLayout
      title="Company Profile"
      description="Configure your company profile, branding, and company-specific settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Company Profile" },
      ]}
      maxWidth="xl"
    >
      {/* Add top spacing to move content down */}
      <Box sx={{ mt: 2 }} />

      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: "8px" }}
          onClose={clearError}
        >
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {/* Main Content with Built-in Action Buttons */}
      <MainContainerBox
        title="Configuration"
        showBuild={true}
        showSave={true}
        showUpload={true}
        showRefresh={true}
        onBuild={handleBuild}
        onSave={handleSave}
        onUpload={handleUpload}
        onRefresh={handleRefresh}
        saveDisabled={!hasUnsavedChanges || isLoading}
      >
        <Box sx={{ minHeight: "400px" }}>
          {isLoading ? (
            <CompanyProfileLoading />
          ) : safeCompanies.length > 0 ? (
            <CompanyProfileGrid
              companies={safeCompanies}
              onEditCompany={handleEditCompany}
              onRemoveCompany={handleRemoveCompany}
            />
          ) : (
            <CompanyProfileEmptyState onBuild={handleBuild} />
          )}
        </Box>
      </MainContainerBox>

      {/* Settings Panel - schema-driven, preserving existing fields */}
      <GenericSettingsPanel<SettingsData>
        isOpen={isSettingsOpen || false}
        onClose={handleCloseSettings}
        onApply={() => handleApplySettingsWithData()}
        schema={COMPANY_PROFILE_SETTINGS_SCHEMA}
        data={{
          name: currentCompany?.name ?? "",
          companyRegNumber: currentCompany?.companyRegNumber ?? "",
          email: currentCompany?.email ?? "",
          address: currentCompany?.address ?? "",
          country: currentCompany?.country ?? "",
          postalCode: currentCompany?.postalCode ?? "",
          contact: currentCompany?.contact ?? "",
          logoUrl: currentCompany?.logoUrl ?? "",
        }}
        onDataChange={(newData) => {
          // Keep the same CompanyFormData shape
          const mapped: CompanyFormData = {
            name: String(newData.name || ""),
            companyRegNumber: String(newData.companyRegNumber || ""),
            email: String(newData.email || ""),
            address: String(newData.address || ""),
            country: String(newData.country || ""),
            postalCode: String(newData.postalCode || ""),
            contact: String(newData.contact || ""),
            logoUrl: newData.logoUrl ? String(newData.logoUrl) : undefined,
          };
          handleFormDataChange(mapped);
        }}
        title={isEditMode ? "Edit Company Profile" : "Add Company Profile"}
        showSectionHeaders
        collapsibleSections
      />
    </PageLayout>
  );
};

export default CompanyProfilePage;
