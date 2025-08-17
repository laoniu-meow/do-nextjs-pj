"use client";

import React from "react";
import { PageLayout } from "@/components/ui";

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
      <div className="space-y-6">{/* Content will be added here */}</div>
    </PageLayout>
  );
}
