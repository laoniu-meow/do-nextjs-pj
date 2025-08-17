"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";

export default function CompanyProfilePage() {
  return (
    <PageLayout
      title="Company Profile"
      description="Manage your company information, contact details, branding, and business settings. This information will be displayed on your website and used for business communications."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Company Profile" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Company Information"
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
