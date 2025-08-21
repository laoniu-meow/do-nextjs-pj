"use client";

import React, { useState } from "react";
import {
  PageLayout,
  MainContainerBox,
  SettingsPanel,
  ResponsiveTabs,
  ResponsiveView,
} from "@/components/ui";

export default function FooterPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ResponsiveView>("desktop");

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

  // Handle responsive view change
  const handleViewChange = (view: ResponsiveView) => {
    setCurrentView(view);
  };

  return (
    <PageLayout
      title="Footer"
      description="Configure your website footer, footer links, and footer-specific settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Footer" },
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
        {/* Responsive Tabs */}
        <ResponsiveTabs
          currentView={currentView}
          onViewChange={handleViewChange}
          showIcons={true}
        />

        <div className="space-y-6">
          {/* Footer configuration content will be added here */}
        </div>
      </MainContainerBox>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">Footer settings will be added here</p>
        </div>
      </SettingsPanel>
    </PageLayout>
  );
}
