import { PageLayout } from "@/components/ui";

export default function UsersPage() {
  return (
    <PageLayout
      title="Users"
      description="Manage user accounts, permissions, and access controls. View, edit, and maintain user information."
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
      maxWidth="xl"
    >
      <div>{/* Users content will be added here when needed */}</div>
    </PageLayout>
  );
}
