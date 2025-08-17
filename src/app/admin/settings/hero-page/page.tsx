"use client";

import { PageLayout, MainContainerBox } from "@/components/ui";

export default function HeroPage() {
  return (
    <PageLayout
      title="Hero Page"
      description="Configure your website hero section, landing page content, and call-to-action elements."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Hero Page" },
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
          {/* Hero page configuration content will be added here */}
        </div>
      </MainContainerBox>
    </PageLayout>
  );
}
