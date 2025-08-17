"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";

export default function QuickNavigationPage() {
  return (
    <PageLayout
      title="Quick Navigation"
      description="Configure your website quick navigation shortcuts, quick links, and rapid access settings."
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
        onBuild={() => console.log("Build clicked")}
        onSave={() => console.log("Save clicked")}
        onUpload={() => console.log("Upload clicked")}
        onRefresh={() => console.log("Refresh clicked")}
      >
        <div className="space-y-6">
          {/* Quick navigation configuration content will be added here */}
        </div>
      </MainContainerBox>
    </PageLayout>
  );
}
