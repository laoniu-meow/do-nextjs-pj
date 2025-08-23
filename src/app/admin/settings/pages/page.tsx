"use client";

import React, { useState } from "react";
import {
  PageLayout,
  MainContainerBox,
  SettingsPanel,
  ResponsiveTabs,
  ResponsiveView,
} from "@/components/ui";

export default function PagesPage() {
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
      title="Pages"
      description="Configure your website pages, content structure, and page-specific settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Pages" },
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
          {/* Pages configuration content will be added here */}
        </div>
      </MainContainerBox>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">Pages settings will be added here</p>
        </div>
      </SettingsPanel>
    </PageLayout>
  );
}
