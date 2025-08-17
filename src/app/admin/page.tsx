import AdminMenuButton from "@/components/ui/AdminMenuButton";

export default function AdminPage() {
  return (
    <main className="admin-page">
      <AdminMenuButton />
      <div className="admin-content">
        {/* Admin page content will go here */}
        <h1 className="sr-only">Admin Dashboard</h1>
      </div>
    </main>
  );
}
