import React from "react";
import AdminMenuButton from "@/components/ui/navigation/AdminMenuButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {/* Admin Menu Button - Available on all admin pages */}
      <AdminMenuButton />

      {/* Page Content */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
