import { PageLayout } from "@/components/ui";

export default function FooterPage() {
  return (
    <PageLayout
      title="Footer Settings"
      description="Configure your website footer, links, and branding information."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Footer" },
      ]}
      maxWidth="xl"
    >
      <div>{/* Footer settings content will be added here when needed */}</div>
    </PageLayout>
  );
}
