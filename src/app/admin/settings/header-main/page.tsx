"use client";

import React from "react";
import { PageLayout } from "@/components/ui";

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
      <div className="space-y-6">{/* Content will be added here */}</div>
    </PageLayout>
  );
}
