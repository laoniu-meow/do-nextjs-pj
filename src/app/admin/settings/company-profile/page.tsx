"use client";

import React, { useState } from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { DynamicSettingsPanel } from "@/components/settings";

export default function CompanyProfilePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleBuild = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleApplySettings = () => {
    // TODO: Implement settings application logic
    setIsSettingsOpen(false);
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
      <MainContainerBox
        title="Configuration"
        showBuild={true}
        showSave={true}
        showUpload={true}
        showRefresh={true}
        onBuild={handleBuild}
        onSave={() => console.log("Save clicked")}
        onUpload={() => console.log("Upload clicked")}
        onRefresh={() => console.log("Refresh clicked")}
      >
        <div className="space-y-6">
          {/* Company profile configuration content will be added here */}
        </div>
      </MainContainerBox>

      <DynamicSettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
      />
    </PageLayout>
  );
}
