"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";

export default function MenuNavigationPage() {
  return (
    <PageLayout
      title="Menu Navigation"
      description="Configure your website navigation menu structure, links, and menu item settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Menu Navigation" },
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
          {/* Menu navigation configuration content will be added here */}
        </div>
      </MainContainerBox>
    </PageLayout>
  );
}
