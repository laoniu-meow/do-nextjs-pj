"use client";

import React from "react";
import { PageLayout } from "@/components/ui";

export default function AdminPage() {
  return (
    <PageLayout
      title="Dashboard"
      description="Welcome to your admin dashboard. Manage your website, content, and settings from here."
      breadcrumbs={[{ label: "Admin" }]}
      maxWidth="xl"
    >
      <div className="space-y-6">{/* Content will be added here */}</div>
    </PageLayout>
  );
}
