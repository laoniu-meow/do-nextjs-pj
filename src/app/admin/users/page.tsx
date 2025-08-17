"use client";

import React, { useState } from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { DynamicSettingsPanel } from "@/components/settings";

export default function UsersPage() {
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
      title="User Management"
      description="Manage users, roles, and permissions in your application."
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="User Configuration"
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
              User Management Configuration
            </h3>
            <p className="text-gray-600">
              Click the &ldquo;Build&rdquo; button to open the settings panel
              and configure user management settings.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Note: The settings panel will automatically show user management
              settings for this page.
            </p>
          </div>
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
