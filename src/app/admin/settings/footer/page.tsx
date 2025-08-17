"use client";

import { PageLayout, MainContainerBox } from "@/components/ui";

export default function FooterPage() {
  return (
    <PageLayout
      title="Footer"
      description="Configure your website footer, links, and branding information."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Footer" },
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
          {/* Footer configuration content will be added here */}
        </div>
      </MainContainerBox>
    </PageLayout>
  );
}
