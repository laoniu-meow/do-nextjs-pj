import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {/* Page Content */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
