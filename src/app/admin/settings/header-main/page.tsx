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
      <div>
        {/* Header & Main settings content will be added here when needed */}
      </div>
    </PageLayout>
  );
}
