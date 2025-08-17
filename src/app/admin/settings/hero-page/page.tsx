import { PageLayout } from "@/components/ui";

export default function HeroPage() {
  return (
    <PageLayout
      title="Hero Page Settings"
      description="Configure your website hero section, landing page content, and call-to-action elements."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Hero Page" },
      ]}
      maxWidth="xl"
    >
      <div>
        {/* Hero page settings content will be added here when needed */}
      </div>
    </PageLayout>
  );
}
