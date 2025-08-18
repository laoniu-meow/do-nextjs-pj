"use client";

import React, { useState } from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { DynamicSettingsPanel } from "@/components/settings";

export default function HeaderMainSettingsPage() {
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
      title="Header & Main"
      description="Customize your website header, navigation, and main layout settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Header & Main" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Header Configuration"
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
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Header &amp; Main Layout Configuration
            </h3>
          </div>
        </div>
      </MainContainerBox>

      <DynamicSettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
        onFormDataChange={() => {}} // Placeholder for form data changes
      />
    </PageLayout>
  );
}
