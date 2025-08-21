"use client";

import React, { useState } from "react";
import { PageLayout } from "@/components/ui";
import { DynamicSettingsPanel } from "@/components/settings";

export default function UsersPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      {/* Your user management content goes here */}

      <DynamicSettingsPanel
        pageType="company-profile"
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
        onFormDataChange={() => {}} // Placeholder for form data changes
      />
    </PageLayout>
  );
}
