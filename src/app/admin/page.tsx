import { PageLayout } from "@/components/ui";

export default function AdminPage() {
  return (
    <PageLayout
      title="Dashboard"
      description="Welcome to your admin dashboard. Manage your website, content, and settings from here."
      breadcrumbs={[{ label: "Admin" }]}
      maxWidth="xl"
    >
      <div>{/* Dashboard content will be added here when needed */}</div>
    </PageLayout>
  );
}
