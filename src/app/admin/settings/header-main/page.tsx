"use client";

import React, { useState } from "react";
import { PageLayout, MainContainerBox, SettingsPanel } from "@/components/ui";

export default function HeaderMainPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleBuild = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleApplySettings = () => {
    // TODO: Implement settings application logic
    console.log("Settings applied");
    setIsSettingsOpen(false);
  };

  return (
    <PageLayout
      title="Header Main"
      description="Configure your website header, navigation, and header-specific settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Header Main" },
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
          {/* Header main configuration content will be added here */}
        </div>
      </MainContainerBox>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">
            Header Main settings will be added here
          </p>
        </div>
      </SettingsPanel>
    </PageLayout>
  );
}
