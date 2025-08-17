import { PageLayout } from "@/components/ui";

export default function PagesPage() {
  return (
    <PageLayout
      title="Pages Settings"
      description="Manage your website pages, content structure, and page-specific configurations."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Pages" },
      ]}
      maxWidth="xl"
    >
      <div>{/* Pages settings content will be added here when needed */}</div>
    </PageLayout>
  );
}
