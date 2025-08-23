"use client";

import React, { useState } from "react";
import { PageLayout, MainContainerBox, SettingsPanel } from "@/components/ui";

export default function QuickNavigationPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleBuild = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleApplySettings = () => {
    // TODO: Implement settings application logic
    console.warn("Settings applied");
    setIsSettingsOpen(false);
  };

  return (
    <PageLayout
      title="Quick Navigation"
      description="Configure quick navigation shortcuts and access points for your website."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Quick Navigation" },
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
        onSave={() => console.warn("Save clicked")}
        onUpload={() => console.warn("Upload clicked")}
        onRefresh={() => console.warn("Refresh clicked")}
      >
        <div className="space-y-6">
          {/* Quick navigation configuration content will be added here */}
        </div>
      </MainContainerBox>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">
            Quick Navigation settings will be added here
          </p>
        </div>
      </SettingsPanel>
    </PageLayout>
  );
}
