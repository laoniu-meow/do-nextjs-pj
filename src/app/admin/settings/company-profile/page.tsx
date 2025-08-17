"use client";

import {
  PageLayout,
  MainContentBox,
  RoundIconButton,
  PillButton,
  CompanyProfileCard,
} from "@/components/ui";
import { Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import LoopIcon from "@mui/icons-material/Loop";
import AddIcon from "@mui/icons-material/Add";

export default function CompanyProfilePage() {
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
              sx={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            />
            <RoundIconButton
              icon={<CloudSyncIcon />}
              variant="primary"
              size="medium"
              tooltip="Upload"
              sx={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            />
            <RoundIconButton
              icon={<LoopIcon />}
              variant="primary"
              size="medium"
              tooltip="Refresh"
              sx={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            />
          </Box>
        </Box>

        {/* Add Company Button - Third on mobile, with narrower height */}
        <Box
          sx={{
            mb: 0.5,
            order: { xs: 3, sm: 3 },
          }}
        >
          <PillButton
            label="Add Company"
            icon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={() => {
              // TODO: Implement add company logic
            }}
          />
        </Box>

        {/* Company Profile Cards Grid */}
        <Box sx={{ mt: 3 }}>
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
            {/* Main Company Card */}
            <CompanyProfileCard
              type="main"
              companyName="Sample Company Ltd"
              companyRegNumber="REG123456"
              address="123 Business Street, Suite 100"
              country="United States"
              postalCode="12345"
              email="info@samplecompany.com"
              contact="+1 (555) 123-4567"
              onSave={(data) => {
                // TODO: Implement save to Company Staging Table
                // Data will be sent to API endpoint for processing
              }}
            />

            {/* Example Branch Card */}
            <CompanyProfileCard
              type="branch"
              companyName="Sample Company Branch"
              companyRegNumber="REG789012"
              address="456 Branch Avenue, Floor 2"
              country="United States"
              postalCode="67890"
              email="branch@samplecompany.com"
              contact="+1 (555) 987-6543"
              onSave={(data) => {
                // TODO: Implement save to Company Staging Table
                // Data will be sent to API endpoint for processing
              }}
              onRemove={() => {
                // TODO: Implement removal logic
                // Removal will be handled by API endpoint
              }}
            />
          </Box>
        </Box>
        {/* Company Information content will be added here */}
      </MainContentBox>
    </PageLayout>
  );
}
