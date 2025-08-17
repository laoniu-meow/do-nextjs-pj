"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";

export default function HeaderMainPage() {
  return (
    <PageLayout
      title="Header & Main"
      description="Configure your website header, navigation, and main content area settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Header & Main" },
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
          {/* Company profile content will be added here */}
        </div>
      </MainContainerBox>
    </PageLayout>
  );
}
